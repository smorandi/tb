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
var dashboardService = require("../services/dashboard.service");
var pricingService = require("../services/pricing.service");

var pricingCollection = require("../cqrs/viewmodels/pricing/collection");
var engineCollection = require("../cqrs/viewmodels/engine/collection");

var engineStatus = "idle";
var enginePriceReductionInterval = config.defaults.priceReductionInterval;
var enginePriceReductionGracePeriod = config.defaults.priceReductionGracePeriod;
var timer;


var orderConfirmedListener = function orderConfirmed(event) {
    if (event.name === "orderConfirmed") {
        var order = event.payload;

        logger.debug("received orderConfirmed event - ", order);

        var tasks = [
            function (callback) {
                pricingService.calculateNewPricesForDrinksInOrder(order, function (err, drinkIdPriceMap) {
                    var commandFns = [];
                    _.forOwn(drinkIdPriceMap, function (newPrice, drinkId) {
                        var priceEntry = new models.PriceEntry(newPrice, "order confirmed calculation");
                        var commandFunction = commandService.send("changePrice").for("drink").instance(drinkId).with({payload: priceEntry});
                        commandFns.push(commandFunction);
                    });
                    callback(null, commandFns);
                });
            },
            function (commandFns, callback) {
                commandService.sendCommands(commandFns, function (err) {
                    err ?
                        callback(err) :
                        callback(null, !_.isEmpty(commandFns));
                });
            },
            function (shouldEmit, callback) {
                shouldEmit ?
                    dashboardService.emitDashboard(callback) :
                    (logger.debug("nothing to emit"), callback(null));
            },
        ];

        async.waterfall(tasks, function (err) {
            err ?
                logger.error("error in price calculation", err) :
                logger.debug("order confirmed price calculations finished");
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
            createEngine(function (err, engine) {
                if (err) {
                    callback(err);
                }
                else {
                    engineStatus = engine.status;
                    enginePriceReductionInterval = engine.priceReductionInterval;
                    enginePriceReductionGracePeriod = engine.priceReductionGracePeriod;
                    callback(null);
                }
            });
        }
        else {
            var engine = docs[0].toJSON();
            engineStatus = engine.status;
            enginePriceReductionInterval = engine.priceReductionInterval;
            enginePriceReductionGracePeriod = engine.priceReductionGracePeriod;
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
            var timebase = new Date().getTime();
            var gracePeriod = enginePriceReductionGracePeriod;
            pricingService.calculateNewPricesForTimebase(timebase, gracePeriod, function (err, drinkIdPriceMap) {
                var commandFns = [];
                _.forOwn(drinkIdPriceMap, function (newPrice, drinkId) {
                    var priceEntry = new models.PriceEntry(newPrice, "price reduction loop");
                    var commandFunction = commandService.send("changePrice").for("drink").instance(drinkId).with({payload: priceEntry});
                    commandFns.push(commandFunction);
                });
                callback(null, commandFns);
            })
        },
        function (commandFns, callback) {
            commandService.sendCommands(commandFns, function (err) {
                err ?
                    callback(err) :
                    callback(null, !_.isEmpty(commandFns));
            });
        },
        function (shouldEmit, callback) {
            shouldEmit ?
                dashboardService.emitDashboard(callback) :
                (logger.debug("nothing to emit"), callback(null));
        },
    ];

    async.waterfall(tasks, callback);
}

function restartLoop() {
    clearInterval(timer);

    if (isStarted()) {
        timer = setInterval(function () {
            loop(function (err) {
                if (err) {
                    logger.error("error in loop - ", err);
                }
                else {
                    logger.trace("loop completed");
                }
            })
        }, enginePriceReductionInterval);
    }
}

function changePriceReductionInterval(interval, callback) {
    commandService.send("changePriceReductionInterval").for("engine").instance("engine").with({payload: {priceReductionInterval: interval}}).go(function (event) {
        logger.debug("interval changed")
        enginePriceReductionInterval = event.payload.priceReductionInterval;
        restartLoop();
        callback(null, event.payload);
    });
}

function changePriceReductionGracePeriod(gracePeriod, callback) {
    commandService.send("changePriceReductionGracePeriod").for("engine").instance("engine").with({payload: {priceReductionGracePeriod: gracePeriod}}).go(function (event) {
        logger.debug("gracePeriod changed")
        enginePriceReductionGracePeriod = event.payload.priceReductionGracePeriod;
        restartLoop();
        callback(null, event.payload);
    });
}

function startEngine(callback) {
    if (!isStarted()) {
        commandService.send("startEngine").for("engine").instance("engine").go(function (event) {
            eventBus.on(config.eventBusChannel_denormalizerEvent, orderConfirmedListener);
            logger.debug("engine started - ", enginePriceReductionInterval, enginePriceReductionGracePeriod);
            engineStatus = event.payload.status;
            restartLoop();
            dashboardService.emitDashboard(function (err) {
                err ?
                    callback(err) :
                    callback(null, event.payload);
            });
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

module.exports = {
    init: init,
    start: startEngine,
    stop: stopEngine,
    changePriceReductionInterval: changePriceReductionInterval,
    changePriceReductionGracePeriod: changePriceReductionGracePeriod,
};
