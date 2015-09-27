/**
 * Created by Stefano on 27.09.2015.
 */
"use strict";

var async = require("async");
var _ = require("lodash");
var engine = require("./../core/engine");
var logger = require("../utils/logger");
var config = require(".././config");
var denormalizerService = require("./denormalizer.service.js");
var domainService = require("./domain.service.js");
var sagaService = require("./saga.service.js");
var commandService = require("./command.service.js");
var models = require("../core/models");

function startEngine(callback) {
    engine.start(callback);
}

function stopEngine(callback) {
    engine.stop(callback);
}

function changePriceReductionInterval(interval, callback) {
    engine.changePriceReductionInterval(interval, callback);
}

function init(callback) {
    var tasks = [
        function (callback) {
            logger.info("initialize domain-service");
            domainService.init(callback);
        },
        function (callback) {
            logger.info("initialize denormalizer-service");
            denormalizerService.init(callback);
        },
        function (callback) {
            logger.info("initialize saga-service");
            sagaService.init(callback);
        },
        function (callback) {
            // replay is not strictly necessary...only if we use an in-memory db
            logger.info("replay events");
            replay(callback);
        },
        function (callback) {
            logger.info("initialize the engine");
            engine.init(callback);
        }
    ];

    async.series(tasks, function (err) {
        callback(err)
    });
};

function clearAll(callback) {
    logger.info("clearing everything...");

    var tasks = [
        function (callback) {
            domainService.clear(function (err) {
                callback(err);
            });
        },
        function (callback) {
            sagaService.clear(function (err) {
                callback(err);
            });
        },
        function (callback) {
            denormalizerService.clear(function (err) {
                callback(err);
            });
        }
    ];

    async.series(tasks, function (err) {
        callback(err);
    });
};


function replay(callback) {
    var tasks = [
        function (callback) {
            logger.trace("clearing view-models...");
            denormalizerService.clear(function (err) {
                callback(err);
            });
        },
        function (callback) {
            logger.trace("retrieving events...");
            domainService.getEvents(function (err, evts) {
                callback(null, evts);
            });
        },
        function (evts, callback) {
            logger.trace("replaying events...");
            var eventPayload = _.map(evts, "payload");
            denormalizerService.replay(eventPayload, function (err) {
                callback(err);
            });
        }
    ];

    async.waterfall(tasks, function (err) {
        callback(err);
    });
}


function reInit(callback) {
    var tasks = [
        function (callback) {
            clearAll(function (err) {
                callback(err);
            });
        },
        function (callback) {
            init(function (err) {
                callback(err);
            });
        },
        function (callback) {
            createStandardSet(function (err) {
                callback(err);
            });
        }
    ];

    async.series(tasks, function (err) {
        callback(err);
    });
};

function createStandardSet(callback) {
    var admin0 = new models.Admin("admin", "admin", "admin", "admin");
    var customer0 = new models.Customer("customer", "customer", "customer", "customer");
    var drink0 = new models.Drink("Gin Tonic", "a supi ginny tonic", "3dl", "alcoholic", ["gin", "alcoholic"], 10, 4, 15, 0.1);
    var drink1 = new models.Drink("Coffee", "wakey wakey", "3dl", "non-alcoholic", ["coffee", "non-alcoholic"], 4, 2.5, 6, 0.2);

    var commands = [];
    commands.push(commandService.send("createAdmin").for("user").instance("admin0").with({payload: admin0}));
    commands.push(commandService.send("createCustomer").for("user").instance("customer0").with({payload: customer0}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink0").with({payload: drink0}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink1").with({payload: drink1}));

    commandService.sendCommands(commands, function (err) {
        callback(err);
    });
}

module.exports = {
    init: init,
    replay: replay,
    reInit: reInit,
    startEngine: startEngine,
    stopEngine: stopEngine,
    changePriceReductionInterval: changePriceReductionInterval,
    createStandardSet: createStandardSet,
};