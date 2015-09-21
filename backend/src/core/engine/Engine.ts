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
var engineCollection = require("../../cqrs/viewmodels/engine/collection");
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
    private recalculationInterval:number = 5000;

    constructor() {
    }

    public getStatus():string {
        return this.status;
    }

    public isActive() {
        return this.status === "started";
    }

    private createEngine(callback) {
        commandService.send("createEngine").for("engine").instance("engine").go(event => {
            logger.debug("engine created...")
            this.status = event.payload.status;
            this.recalculationInterval = event.payload.recalculationInterval;
            callback(null, event.payload);
        });
    }

    public restoreState(callback) {
        engineCollection.findViewModels({id: "engine"}, (err, docs) => {
            if (err) {
                callback(err);
            }
            else if (_.isEmpty(docs)) {
                this.createEngine(callback);
            }
            else {
                this.status = docs[0].toJSON().status;
                this.recalculationInterval = docs[0].toJSON().recalculationInterval;
                callback(null);
            }
        });
    }

    private restartLoop() {
        clearInterval(timer);

        if (this.isActive()) {
            timer = setInterval(() => this.loop((err) => {
                if (err) {
                    logger.error("error in loop: ", err);
                }
                else {
                    logger.trace("loop completed");
                }
            }), this.recalculationInterval);
        }
    }

    public changePriceReductionInterval(payload, callback) {
        commandService.send("changePriceReductionInterval").for("engine").instance("engine").with({payload: payload}).go(event => {
            logger.debug("interval changed...")
            this.recalculationInterval = event.payload.recalculationInterval;
            this.restartLoop();
            callback(null, event.payload);
        });
    }

    public activate(callback:any):void {
        commandService.send("startEngine").for("engine").instance("engine").go(event => {
            eventBus.on(config.eventBusChannel_denormalizerEvent, listener);
            logger.debug("engine activated...", this.recalculationInterval);
            this.status = event.payload.status;
            this.restartLoop();
            callback(null, event.payload);
        });
    }

    public deactivate(callback:any):void {
        commandService.send("stopEngine").for("engine").instance("engine").go(event => {
            logger.debug("engine deactivated...")
            eventBus.removeListener(config.eventBusChannel_denormalizerEvent, listener);
            clearInterval(timer);

            this.status = "idle";
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
                            if ((timebase - drinkTimeBase) > 1000) {
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

    private emitDashboard(callback) {
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
        })
    }

    private loop(callback) {
        var tasks = [
            (callback) => {
                this.recalculatePriceDecrease(callback);
            },
            (callback) => {
                this.emitDashboard(callback);
            },
        ];
        async.series(tasks, callback);
    }
}

var timer:NodeJS.Timer;
export =
new Engine();