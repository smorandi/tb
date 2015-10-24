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

function initCQRSServices(callback) {
    logger.info("initialize CQRS services");

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
        }
    ];

    async.series(tasks, callback);
}

function clearAll(callback) {
    logger.info("clearing all databases");

    var tasks = [
        function (callback) {
            logger.info("clearing domain DB ");
            domainService.clear(callback);
        },
        function (callback) {
            logger.info("clearing saga DB ");
            sagaService.clear(callback);
        },
        function (callback) {
            logger.info("clearing denormalizer DB ");
            denormalizerService.clear(callback);
        }
    ];

    async.series(tasks, callback);
};


function replay(callback) {
    logger.info("replay events");

    var tasks = [
        function (callback) {
            logger.trace("clearing view-models...");
            denormalizerService.clear(callback);
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
            denormalizerService.replay(eventPayload, callback);
        }
    ];

    async.waterfall(tasks, callback);
}


function reInit(callback) {
    logger.info("re-initialize DB (with standard-set)");

    var tasks = [
        function (callback) {
            clearAll(callback);
        },
        function (callback) {
            createStandardSet(callback);
        },
        function (callback) {
            engine.init(callback);
        },
    ];

    async.series(tasks, callback);
};

function createStandardSet(callback) {
    logger.info("creating standard-set");

    var root0 = new models.Root("root", "root", "root", "root");
    var admin0 = new models.Admin("admin", "admin", "admin", "admin");
    var customer0 = new models.Customer("customer", "customer", "customer", "customer");
    var drink0 = new models.Drink("Gin Tonic", "a supi ginny tonic", "3dl", "alcoholic", ["gin", "alcoholic"], 10, 4, 15, 0.1);
    var drink1 = new models.Drink("Coffee", "wakey wakey", "3dl", "non-alcoholic", ["coffee", "non-alcoholic"], 4, 2.5, 6, 0.2);

    var commands = [];
    commands.push(commandService.send("createRoot").for("user").instance("root0").with({payload: root0}));
    commands.push(commandService.send("createAdmin").for("user").instance("admin0").with({payload: admin0}));
    commands.push(commandService.send("createCustomer").for("user").instance("customer0").with({payload: customer0}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink0").with({payload: drink0}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink1").with({payload: drink1}));

    commandService.sendCommands(commands, callback);
}

function init(clear, populate, callback) {
    logger.info("initialize the system - clear=%s, populate=%s", clear, populate);

    var tasks = [];

    tasks.push(function (callback) {
        initCQRSServices(callback);
    });

    // either we clear or replay...
    if (clear) {
        tasks.push(function (callback) {
            clearAll(callback);
        });
    }
    else {
        tasks.push(function (callback) {
            // replay is actually not strictly necessary...only if we use an in-memory db
            // (however, it does not hurt either, performance loss is neglectible)
            replay(callback);
        });
    }

    if (populate) {
        tasks.push(function (callback) {
            createStandardSet(callback);
        });
    }

    tasks.push(function (callback) {
        engine.init(callback);
    });

    async.series(tasks, callback);
};

module.exports = {
    init: init,
    reInit: reInit,
    replay: replay,
    startEngine: startEngine,
    stopEngine: stopEngine,
    changePriceReductionInterval: changePriceReductionInterval,
    createStandardSet: createStandardSet,
};