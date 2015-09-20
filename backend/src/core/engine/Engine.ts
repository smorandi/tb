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
        _.forEach(order.orderItems, function (orderItem:any) {
            pricingCollection.loadViewModel(orderItem.item.id, function (err, doc) {
                var drink = doc.toJSON();

                var currentPrice = drink.price;
                var priceStep = drink.priceStep;
                var maxPrice = drink.maxPrice;
                var newPrice = Math.min(currentPrice + (priceStep * orderItem.number), maxPrice);

                var priceEntry = new models.PriceEntry(newPrice, "order confirmed recalculation");

                commands.push(commandService.send("changePrice").for("drink").instance(drink.id).with({payload: priceEntry}));
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
            })
        }, function (err) {
            callback(err);
        }
    );
}

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

    private recalculatePriceDecrease(callback:any):void {
        logger.debug("decreasing Prices...");
        if (!this.isActive()) {
            callback(null);
        }
        else {
            pricingCollection.findViewModels({}, (err, docs) => {
                if (err) {
                    logger.error("error in retrieving drinks", err);
                    callback(err);
                }
                else {
                    var timebase = new Date().getTime();
                    var commands = [];
                    docs.forEach((doc) => {
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

                                commands.push(commandService.send("changePrice").for("drink").instance(drink.id).with({payload: priceEntry}));
                            }
                        }
                    });

                    sendCommandsSynced(commands, callback);
                }
            });
        }
    }

    public resetPrices(callback) {
        pricingCollection.findViewModels({}, (err, docs) => {
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
    }

    private emitDashboard() {
        logger.debug("emitting dashboard...");

        dashboardCollection.findViewModels({}, function (err, docs) {
            var drinksInJson = _.invoke(docs, "toJSON");

            webSocketService.broadcast(config.websocketChannel_dashboard, drinksInJson);
        })
    }

    private loop() {
        this.recalculatePriceDecrease(function (err) {
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