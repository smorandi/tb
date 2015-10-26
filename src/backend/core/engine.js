/**
 * Created by Stefano on 23.08.2015.
 */
"use strict";

var _ = require("lodash");
var async = require("async");
var logger = require("../utils/logger");
var config = require("../config");
var models = require("./models");
var eventBus = require("../services/eventbus.service.js");
var commandService = require("../services/command.service.js");
var webSocketService = require("../services/websocket.service.js");
var pricingCollection = require("../cqrs/viewmodels/pricing/collection");
var dashboardCollection = require("../cqrs/viewmodels/dashboard/collection");
var engineCollection = require("../cqrs/viewmodels/engine/collection");


var engineStatus = "idle";
var engineRecalculationInterval = 5000;
var timer;
var orderConfirmedListener = function ocl(event) {
    if (event.name === "orderConfirmed") {
        var order = event.payload;
        var drinks = _.map(order.orderItems, "item");

        _.forEach(order.orderItems, function (orderItem) {
            pricingCollection.loadViewModel(orderItem.item.id, function (err, doc) {
                var drink = doc.toJSON();

                var currentPrice = drink.price;
                var priceStep = drink.priceStep;
                var maxPrice = drink.maxPrice;
                var newPrice = Math.min(currentPrice + (priceStep * orderItem.number), maxPrice);

                var priceEntry = new models.PriceEntry(newPrice, "order confirmed recalculation");

                var commands = [];
                commands.push(commandService.send("changePrice").for("drink").instance(drink.id).with({payload: priceEntry}));
                commandService.sendCommands(commands, function (err) {
                    if(err) {
                        logger.error(err);
                    }
                });
            });
        });
    }
};

function isStarted() {
    return engineStatus === "running";
}

function getStatus() {
    return engineStatus;
}


function createEngine(callback) {
    commandService.send("createEngine").for("engine").instance("engine").go(function (event) {
        logger.debug("engine created")
        callback(null, event.payload);
    });
}

function syncWithDB(callback) {
    engineCollection.findViewModels({id: "engine"}, {limit: 1}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else if (_.isEmpty(docs)) {
            logger.debug("no engine found - creating new engine")
            createEngine(function (err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    engineStatus = data.status;
                    engineRecalculationInterval = data.priceReductionInterval;
                    callback(null);
                }
            });
        }
        else {
            engineStatus = docs[0].toJSON().status;
            engineRecalculationInterval = docs[0].toJSON().priceReductionInterval;
            callback(null);
        }
    });
}

function init(callback) {
    logger.info("initialize engine");

    var tasks = [
        function (callback) {
            logger.debug("syncronizing with DB...")
            syncWithDB(callback);
        },
        function (callback) {
            logger.debug("stopping the engine...")
            stopEngine(callback);
        },
        function (callback) {
            logger.debug("resetting prices...")
            resetPrices(callback);
        },
    ];
    async.series(tasks, callback);
}

function loop(callback) {
    var tasks = [
        function (callback) {
            recalculatePriceDecrease(callback);
        },
        function (callback) {
            emitDashboard(callback);
        },
    ];
    async.series(tasks, callback);
}

function restartLoop() {
    clearInterval(timer);

    if (isStarted()) {
        timer = setInterval(function () {
            loop(function (err) {
                if (err) {
                    logger.error("error in loop: ", err);
                }
                else {
                    logger.trace("loop completed");
                }
            })
        }, engineRecalculationInterval);
    }
}

function changePriceReductionInterval(interval, callback) {
    commandService.send("changePriceReductionInterval").for("engine").instance("engine").with({payload: {priceReductionInterval: interval}}).go(function (event) {
        logger.debug("interval changed")
        engineRecalculationInterval = event.payload.priceReductionInterval;
        restartLoop();
        callback(null, event.payload);
    });
}

function startEngine(callback) {
    if (!isStarted()) {
        commandService.send("startEngine").for("engine").instance("engine").go(function (event) {
            eventBus.on(config.eventBusChannel_denormalizerEvent, orderConfirmedListener);
            logger.debug("engine started", engineRecalculationInterval);
            engineStatus = event.payload.status;
            restartLoop();
            callback(null, event.payload);
        });
    }
    else {
        callback(null);
    }
}

function stopEngine(callback) {
    if (isStarted()) {
        commandService.send("stopEngine").for("engine").instance("engine").go(function (event) {
            logger.debug("engine stopped")
            eventBus.removeListener(config.eventBusChannel_denormalizerEvent, orderConfirmedListener);
            clearInterval(timer);

            engineStatus = "idle";
            callback(null, event.payload);
        });
    }
    else {
        callback(null);
    }
}

function resetPrices(callback) {
    pricingCollection.findViewModels({}, function (err, docs) {
        if (err) {
            logger.error("error in retrieving drinks", err);
            callback(err);
        }
        else if (_.isEmpty(docs)) {
            logger.debug("no drinks found to reset prices for");
            callback(null);
        }
        else {
            var commands = _.map(docs, function (doc) {
                return commandService.send("resetPrice").for("drink").instance(doc.toJSON().id);
            });

            commandService.sendCommands(commands, function (err) {
                logger.debug("prices reset");
                callback(err);
            });
        }
    });
}

function emitDashboard(callback) {
    logger.debug("emitting dashboard...");

    dashboardCollection.findViewModels({}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else if (_.isEmpty(docs)) {
            logger.debug("nothing to emit.");
            callback(null);
        }
        else {
            webSocketService.broadcast(config.websocketChannel_dashboard, _.invoke(docs, "toJSON"));
            callback(null);
        }
    })
}

function recalculatePriceDecrease(callback) {
    logger.debug("decreasing prices...");
    if (!isStarted()) {
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

                            commands.push(commandService.send("changePrice").for("drink").instance(drink.id).with({payload: priceEntry}));
                        }
                    }
                });

                commandService.sendCommands(commands, callback);
            }
        });
    }
}

module.exports = {
    init: init,
    start: startEngine,
    stop: stopEngine,
    changePriceReductionInterval: changePriceReductionInterval
};
