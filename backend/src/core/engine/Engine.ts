/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import logger = require("../../config/logger");
import config = require("../../config/config");
import _ = require("lodash");

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
        _.forEach(drinks, function (drink:any) {
            drinksCollection.loadViewModel(drink.id, function (err, doc) {
                var drink = doc.toJSON();
                var currentPrice = drink.priceTicks[0].price;
                var priceStep = drink.priceStep;
                var maxPrice = drink.maxPrice;
                var newPrice = Math.min(currentPrice + priceStep, maxPrice);

                var priceEntry = new models.PriceEntry(newPrice, "order confirmed recalculation");
                commandService.send("changePrice").for("drink").instance(drink.id).with({payload: priceEntry}).go(event => {
                    logger.info("priceChanged");
                });
            });
        });
    }
};

class Engine {
    private status:string = "idle";
    private activationDate:Date = null;
    private lastChangeDate:Date = new Date();
    private updateInterval:number = 5000;

    constructor() {
    }

    public getStatus():string {
        return this.status;
    }

    public getLastChangeDate():Date {
        return this.lastChangeDate;
    }

    public isActive() {
        return this.activationDate !== null;
    }

    public getActiveSince() {
        return this.activationDate ? ((new Date()).getTime() - this.activationDate.getTime()) : -1;
    }

    public activate(callback:any):void {
        commandService.send("startEngine").for("engine").instance("engine").go(event => {
            eventBus.on(config.eventBusChannel_denormalizerEvent, listener);
            logger.debug("engine activated...")
            this.status = "activated";
            this.lastChangeDate = new Date();
            this.activationDate = new Date();
            timer = setInterval(() => this.loop(), this.updateInterval);
            callback(null, event.payload);
        });
    }

    public deactivate(callback:any):void {
        commandService.send("stopEngine").for("engine").instance("engine").go(event => {
            logger.debug("engine deactivated...")
            eventBus.removeListener(config.eventBusChannel_denormalizerEvent, listener);
            clearInterval(timer);

            this.status = "idle";
            this.activationDate = null;
            this.lastChangeDate = new Date();
            callback(null, event.payload);
        });
    }

    private recalculateDashboard(callback:any):void {
        logger.debug("decreasing Prices...");
        drinksCollection.findViewModels({}, (err, docs) => {
            if (err) {
                logger.error("error in retrieving drinks", err);
                callback(err);
            }
            else {
                var tasks = [];
                docs.forEach((doc, index, drinks) => {
                    var drink = doc.toJSON();

                    var currentPrice = drink.priceTicks[0].price;
                    var priceStep = drink.priceStep;
                    var minPrice = drink.minPrice;
                    var newPrice = Math.max(currentPrice - priceStep, minPrice);

                    var priceEntry = new models.PriceEntry(newPrice, "recalculation loop");


                    tasks.push(function b(callback) {
                        commandService.send("changePrice").for("drink").instance(drink.id).with({payload: priceEntry}).go(event => {
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
    }

    public resetPrices(callback) {
        drinksCollection.findViewModels({}, (err, docs) => {
            if (err) {
                logger.error("error in retrieving drinks", err);
                callback(err);
            }
            else {
                var tasks = [];
                docs.forEach((doc, index, drinks) => {
                    var drink = doc.toJSON();

                    tasks.push(function b(callback) {
                        commandService.send("resetPrice").for("drink").instance(drink.id).go(event => {
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
    }

    private emitDashboard() {
        logger.debug("emitting dashboard...");

        dashboardCollection.findViewModels({}, function (err, docs) {
            var dashboard = _.map(docs, function (doc:any) {
                return doc.toJSON();
            });

            webSocketService.broadcast(config.websocketChannel_dashboard, dashboard);
        })
    }

    private loop() {
        this.recalculateDashboard(function (err) {
            if (err) {
                logger.error("error: ", err);
            }
        });
        this.emitDashboard();
    }
}

var timer:NodeJS.Timer;
var engine = new Engine();
export = engine;