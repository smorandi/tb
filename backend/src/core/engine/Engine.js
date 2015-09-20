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
        this.activationDate = null;
        this.lastChangeDate = new Date();
        this.updateInterval = 5000;
    }
    Engine.prototype.getStatus = function () {
        return this.status;
    };
    Engine.prototype.getLastChangeDate = function () {
        return this.lastChangeDate;
    };
    Engine.prototype.isActive = function () {
        return this.activationDate !== null;
    };
    Engine.prototype.getActiveSince = function () {
        return this.activationDate ? ((new Date()).getTime() - this.activationDate.getTime()) : -1;
    };
    Engine.prototype.activate = function (callback) {
        var _this = this;
        commandService.send("startEngine").for("engine").instance("engine").go(function (event) {
            eventBus.on(config.eventBusChannel_denormalizerEvent, listener);
            logger.debug("engine activated...");
            _this.status = "activated";
            _this.lastChangeDate = new Date();
            _this.activationDate = new Date();
            timer = setInterval(function () { return _this.loop(); }, _this.updateInterval);
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
            _this.activationDate = null;
            _this.lastChangeDate = new Date();
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
                            if ((timebase - drinkTimeBase) > 10000) {
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
    Engine.prototype.emitDashboard = function () {
        logger.debug("emitting dashboard...");
        dashboardCollection.findViewModels({}, function (err, docs) {
            var drinksInJson = _.invoke(docs, "toJSON");
            webSocketService.broadcast(config.websocketChannel_dashboard, drinksInJson);
        });
    };
    Engine.prototype.loop = function () {
        this.recalculatePriceDecrease(function (err) {
            if (err) {
                logger.error("error: ", err);
            }
        });
        this.emitDashboard();
    };
    return Engine;
})();
var timer;
var engine = new Engine();
module.exports = engine;
//# sourceMappingURL=Engine.js.map