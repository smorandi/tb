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
var drinksCollection = require("../../cqrs/viewmodels/drinks/collection");
var dashboardCollection = require("../../cqrs/viewmodels/dashboard/collection");
var ordersCollection = require("../../cqrs/viewmodels/orders/collection");
var commandService = require("../../cqrs/command.service");
var webSocketService = require("../../cqrs/websocket.service");
var listener = function ocl(event) {
    if (event.name === "orderConfirmed") {
        var order = event.payload;
        var drinks = _.map(order.orderItems, "item");
        _.forEach(drinks, function (drink) {
            drinksCollection.loadViewModel(drink.id, function (err, doc) {
                var drink = doc.toJSON();
                var currentPrice = drink.priceTicks[0].price;
                var priceStep = drink.priceStep;
                var maxPrice = drink.maxPrice;
                var newPrice = Math.min(currentPrice + priceStep, maxPrice);
                var priceEntry = new models.PriceEntry(newPrice, "order confirmed recalculation");
                commandService.send("changePrice").for("drink").instance(drink.id).with({ payload: priceEntry }).go(function (event) {
                    logger.info("priceChanged");
                });
            });
        });
    }
};
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
    Engine.prototype.recalculateDashboard = function (callback) {
        logger.debug("decreasing Prices...");
        drinksCollection.findViewModels({}, function (err, docs) {
            if (err) {
                logger.error("error in retrieving drinks", err);
                callback(err);
            }
            else {
                var tasks = [];
                docs.forEach(function (doc, index, drinks) {
                    var drink = doc.toJSON();
                    var currentPrice = drink.priceTicks[0].price;
                    var priceStep = drink.priceStep;
                    var minPrice = drink.minPrice;
                    var newPrice = Math.max(currentPrice - priceStep, minPrice);
                    var priceEntry = new models.PriceEntry(newPrice, "recalculation loop");
                    tasks.push(function b(callback) {
                        commandService.send("changePrice").for("drink").instance(drink.id).with({ payload: priceEntry }).go(function (event) {
                            logger.trace("priceChanged for: " + drink.id);
                            callback(null);
                        });
                    });
                });
                async.series(tasks, function (err, results) {
                    logger.info("all prices changed");
                    callback(err);
                });
            }
        });
    };
    Engine.prototype.resetPrices = function (callback) {
        drinksCollection.findViewModels({}, function (err, docs) {
            if (err) {
                logger.error("error in retrieving drinks", err);
                callback(err);
            }
            else {
                var tasks = [];
                docs.forEach(function (doc, index, drinks) {
                    var drink = doc.toJSON();
                    tasks.push(function b(callback) {
                        commandService.send("resetPrice").for("drink").instance(drink.id).go(function (event) {
                            logger.trace("price reset for: " + drink.id);
                            callback(null);
                        });
                    });
                });
                async.series(tasks, function (err, results) {
                    logger.trace("all prices changed");
                    callback(null);
                });
            }
        });
    };
    Engine.prototype.emitDashboard = function () {
        logger.debug("emitting dashboard...");
        dashboardCollection.findViewModels({}, function (err, docs) {
            var dashboard = _.map(docs, function (doc) {
                return doc.toJSON();
            });
            webSocketService.broadcast(config.websocketChannel_dashboard, dashboard);
        });
    };
    Engine.prototype.loop = function () {
        this.recalculateDashboard(function (err) {
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