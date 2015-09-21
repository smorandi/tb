/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var logger = require("../../config/logger");
var config = require("../../config/config");
var _ = require("lodash");
var async = require("async");
var models = require("../../cqrs/models/models");
var eventBus = require("../utils/eventBus");
//var drinksCollection = require("../../cqrs/viewmodels/drinks/collection");
var pricingCollection = require("../../cqrs/viewmodels/pricing/collection");
var dashboardCollection = require("../../cqrs/viewmodels/dashboard/collection");
var engineCollection = require("../../cqrs/viewmodels/engine/collection");
var ordersCollection = require("../../cqrs/viewmodels/orders/collection");
var commandService = require("../../cqrs/command.service");
var webSocketService = require("../../cqrs/websocket.service");
var listener = function ocl(event) {
    if (event.name === "orderConfirmed") {
        var order = event.payload;
        var drinks = _.map(order.orderItems, "item");
        var commands = [];
        _.forEach(order.orderItems, function (orderItem) {
            pricingCollection.loadViewModel(orderItem.item.id, function (err, doc) {
                var drink = doc.toJSON();
                var currentPrice = drink.price;
                var priceStep = drink.priceStep;
                var maxPrice = drink.maxPrice;
                var newPrice = Math.min(currentPrice + (priceStep * orderItem.number), maxPrice);
                var priceEntry = new models.PriceEntry(newPrice, "order confirmed recalculation");
                commands.push(commandService.send("changePrice").for("drink").instance(drink.id).with({ payload: priceEntry }));
            });
        });
        sendCommandsSynced(commands, function (err) {
        });
    }
};
function sendCommandsSynced(sendCommandFns, callback) {
    async.eachSeries(sendCommandFns, function (cmd, callback) {
        cmd.go(function (event) {
            callback(null);
        });
    }, function (err) {
        callback(err);
    });
}
var Engine = (function () {
    function Engine() {
        this.status = "idle";
        this.recalculationInterval = 5000;
    }
    Engine.prototype.getStatus = function () {
        return this.status;
    };
    Engine.prototype.isActive = function () {
        return this.status === "started";
    };
    Engine.prototype.createEngine = function (callback) {
        var _this = this;
        commandService.send("createEngine").for("engine").instance("engine").go(function (event) {
            logger.debug("engine created...");
            _this.status = event.payload.status;
            _this.recalculationInterval = event.payload.recalculationInterval;
            callback(null, event.payload);
        });
    };
    Engine.prototype.restoreState = function (callback) {
        var _this = this;
        engineCollection.findViewModels({ id: "engine" }, function (err, docs) {
            if (err) {
                callback(err);
            }
            else if (_.isEmpty(docs)) {
                _this.createEngine(callback);
            }
            else {
                _this.status = docs[0].toJSON().status;
                _this.recalculationInterval = docs[0].toJSON().recalculationInterval;
                callback(null);
            }
        });
    };
    Engine.prototype.restartLoop = function () {
        var _this = this;
        clearInterval(timer);
        if (this.isActive()) {
            timer = setInterval(function () { return _this.loop(function (err) {
                if (err) {
                    logger.error("error in loop: ", err);
                }
                else {
                    logger.trace("loop completed");
                }
            }); }, this.recalculationInterval);
        }
    };
    Engine.prototype.changePriceReductionInterval = function (payload, callback) {
        var _this = this;
        commandService.send("changePriceReductionInterval").for("engine").instance("engine").with({ payload: payload }).go(function (event) {
            logger.debug("interval changed...");
            _this.recalculationInterval = event.payload.recalculationInterval;
            _this.restartLoop();
            callback(null, event.payload);
        });
    };
    Engine.prototype.activate = function (callback) {
        var _this = this;
        commandService.send("startEngine").for("engine").instance("engine").go(function (event) {
            eventBus.on(config.eventBusChannel_denormalizerEvent, listener);
            logger.debug("engine activated...", _this.recalculationInterval);
            _this.status = event.payload.status;
            _this.restartLoop();
            callback(null, event.payload);
        });
    };
    Engine.prototype.deactivate = function (callback) {
        var _this = this;
        commandService.send("stopEngine").for("engine").instance("engine").go(function (event) {
            logger.debug("engine deactivated...");
            eventBus.removeListener(config.eventBusChannel_denormalizerEvent, listener);
            clearInterval(timer);
            _this.status = "idle";
            callback(null, event.payload);
        });
    };
    Engine.prototype.recalculatePriceDecrease = function (callback) {
        logger.debug("decreasing Prices...");
        if (!this.isActive()) {
            callback(null);
        }
        else {
            pricingCollection.findViewModels({}, function (err, docs) {
                if (err) {
                    logger.error("error in retrieving drinks", err);
                    callback(err);
                }
                else {
                    var timebase = new Date().getTime();
                    var commands = [];
                    docs.forEach(function (doc) {
                        var drink = doc.toJSON();
                        if (drink.priceReductionTimeBase !== null) {
                            logger.info(drink.priceReductionTimeBase);
                            var drinkTimeBase = drink.priceReductionTimeBase.getTime();
                            // only do this for any drinks which have not been ordered since more than 10s...
                            if ((timebase - drinkTimeBase) > 1000) {
                                var currentPrice = drink.price;
                                var priceStep = drink.priceStep;
                                var minPrice = drink.minPrice;
                                var newPrice = Math.max(currentPrice - priceStep, minPrice);
                                var priceEntry = new models.PriceEntry(newPrice, "price reduction loop");
                                commands.push(commandService.send("changePrice").for("drink").instance(drink.id).with({ payload: priceEntry }));
                            }
                        }
                    });
                    sendCommandsSynced(commands, callback);
                }
            });
        }
    };
    Engine.prototype.resetPrices = function (callback) {
        pricingCollection.findViewModels({}, function (err, docs) {
            if (err) {
                logger.error("error in retrieving drinks", err);
                callback(err);
            }
            else {
                var commands = [];
                docs.forEach(function (doc) {
                    commands.push(commandService.send("resetPrice").for("drink").instance(doc.toJSON().id));
                });
                sendCommandsSynced(commands, callback);
            }
        });
    };
    Engine.prototype.emitDashboard = function (callback) {
        logger.debug("emitting dashboard...");
        dashboardCollection.findViewModels({}, function (err, docs) {
            if (err) {
                callback(err);
            }
            else if (_.isEmpty(docs)) {
                logger.debug("nothing to emit...");
                callback(null);
            }
            else {
                webSocketService.broadcast(config.websocketChannel_dashboard, _.invoke(docs, "toJSON"));
                callback(null);
            }
        });
    };
    Engine.prototype.loop = function (callback) {
        var _this = this;
        var tasks = [
            function (callback) {
                _this.recalculatePriceDecrease(callback);
            },
            function (callback) {
                _this.emitDashboard(callback);
            },
        ];
        async.series(tasks, callback);
    };
    return Engine;
})();
var timer;
module.exports = new Engine();
//# sourceMappingURL=Engine.js.map