/**
 * Created by Stefano on 27.09.2015.
 */
"use strict";

var async = require("async");
var _ = require("lodash");
var fileUrl = require("file-url");
var path = require("path");
var engine = require("./../core/engine");
var logger = require("../utils/logger");
var config = require(".././config");
var denormalizerService = require("./denormalizer.service.js");
var domainService = require("./domain.service.js");
var sagaService = require("./saga.service.js");
var commandService = require("./command.service.js");
var models = require("../core/models");
var dashboardService = require("../services/dashboard.service");

function startEngine(callback) {
    engine.start(callback);
}

function stopEngine(callback) {
    engine.stop(callback);
}

function changePriceReductionInterval(interval, callback) {
    engine.changePriceReductionInterval(interval, callback);
}

function changePriceReductionGracePeriod(gracePeriod, callback) {
    engine.changePriceReductionGracePeriod(gracePeriod, callback);
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
}


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
        },
        function (callback) {
            dashboardService.emitDashboard(callback);
        },
    ];

    async.waterfall(tasks, callback);
}


function reInit(callback) {
    logger.info("re-initialize DB (with standard-set)");

    var tasks = [
        function (callback) {
            engine.stop(callback);
        },
        function (callback) {
            clearAll(callback);
        },
        function (callback) {
            createStandardSet(callback);
        },
        function (callback) {
            engine.init(callback);
        },
        function (callback) {
            dashboardService.emitDashboard(callback);
        }
    ];

    async.series(tasks, callback);
}

function createStandardSet(callback) {
    logger.info("creating standard-set");

    var root = new models.Root("root", "root", "root", "root");
    var admin = new models.Admin("admin", "admin", "admin", "admin");
    var customer = new models.Customer("customer", "customer", "customer", "customer");

    var drink0 = new models.Drink("Gin Tonic", "Most favourite drink", 3, "dl", "cocktail", ["alcoholic"], 10, 4, 15, 0.1);
    var drink1 = new models.Drink("Stärböcks", "Fine jamaican blue mountain blend", 3, "dl", "coffee", ["non-alcoholic"], 4, 2.5, 6, 0.2);
    var drink2 = new models.Drink("Duff Bräu", "Ice cold and masterly brewed", 5, "dl", "beer", ["alcoholic"], 5, 3, 9, 0.1);
    var drink3 = new models.Drink("Faustino I.", "Red wine made of superb grapes", 2, "dl", "wine", ["alcoholic"], 4, 3, 15, 0.3);
    var drink4 = new models.Drink("Darjeeling", "Fine indian tea", 2, "dl", "tea", ["non-alcoholic"], 4, 3, 15, 0.3);
    var drink5 = new models.Drink("Tequila", "The mexican favourite", 2, "cl", "shot", ["alcoholic"], 4, 3, 15, 0.3);
    var drink6 = new models.Drink("Dr. Pepper", "Some funny tasting coke", 3, "dl", "soft", ["non-alcoholic"], 4, 3, 15, 0.3);
    var drink7 = new models.Drink("Valser", "Ah, yes! The swiss sparkling refreshment", 3, "dl", "soft", ["non-alcoholic"], 5.5, 3, 15, 0.3);
    var drink8 = new models.Drink("Kaffee Hag", "Also some nice coffee", 3, "dl", "coffee", ["non-alcoholic"], 54.25, 2.5, 60, 0.25);
    var drink9 = new models.Drink("Tequila Sunrise", "Let the sun shine (in your brain)", 2, "dl", "cocktail", ["alcoholic"], 4, 2.5, 6, 0.2);

    var commands = [];
    commands.push(commandService.send("createRoot").for("user").instance("root").with({payload: root}));
    commands.push(commandService.send("createAdmin").for("user").instance("admin").with({payload: admin}));
    commands.push(commandService.send("createCustomer").for("user").instance("customer").with({payload: customer}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink0").with({payload: drink0}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink1").with({payload: drink1}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink2").with({payload: drink2}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink3").with({payload: drink3}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink4").with({payload: drink4}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink5").with({payload: drink5}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink6").with({payload: drink6}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink7").with({payload: drink7}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink8").with({payload: drink8}));
    commands.push(commandService.send("createDrink").for("drink").instance("drink9").with({payload: drink9}));

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
}

module.exports = {
    init: init,
    reInit: reInit,
    replay: replay,
    startEngine: startEngine,
    stopEngine: stopEngine,
    changePriceReductionInterval: changePriceReductionInterval,
    changePriceReductionGracePeriod: changePriceReductionGracePeriod,
    createStandardSet: createStandardSet
};