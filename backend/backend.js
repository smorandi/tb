"use strict";

var http = require("http");
var path = require("path");
var _ = require("lodash");

var cqrs_viewmodel = require("viewmodel");
var cqrs_domain = require("cqrs-domain");
var cqrs_denormalizer = require("cqrs-eventdenormalizer");
var cqrs_eventedCmd = require("evented-command");

var logger = require("./src/config/logger");
var eventBus = require("./src/emitter/emitter");
var config = require("./src/config/config");
var utils = require("./src/config/utils");
var engine = require("./src/engine/engine");
var server;
var viewModelRepository;

var domainOptions = {
    domainPath: __dirname + "/src/domain/aggregates",
    eventStore: {
        type: "mongodb",
        host: "localhost",                          // optional
        port: 27017,                                // optional
        dbName: "domain",                           // optional
        eventsCollectionName: "events",             // optional
        snapshotsCollectionName: "snapshots",       // optional
        transactionsCollectionName: "transactions", // optional
        timeout: 10000                              // optional
    },
};

var viewModelOptions = {
    denormalizerPath: __dirname + "/src/viewmodels",
    repository: {
        type: "inMemory",
        dbName: "query"
    }
};

var defaultCmdDefinition = {
    id: "id",
    name: "name",
    aggregate: "aggregate.name",
    aggregateId: "aggregate.id",
    payload: "payload",
    revision: "aggregate.revision",
    //context: "aggregate.context"
};

var defaultEvtDefinition = {
    correlationId: "commandId",
    id: "id",
    name: "name",
    aggregate: "aggregate.name",
    aggregateId: "aggregate.id",
    payload: "payload",
    revision: "aggregate.revision",
    //context: "aggregate.context"
};

function onInitDenormalizer(err) {
    if (err) {
        logger.fatal(err);
        process.exit(1);
    }

    logger.info(JSON.stringify(cqrs_denormalizerService.getInfo(), null, 2));

    eventBus.on("domain-event", function (evt) {
        logger.info("event-bus -> denormalizer -> handle():  " + evt.name, evt);
        cqrs_denormalizerService.handle(evt);
    });

    cqrs_denormalizerService.onEvent(function (evt) {
        logger.info("denormalizer -> cmd-service: " + evt.name, evt);
        cqrs_cmdService.emit("event", evt);
    });

    // setup special replay channel...
    eventBus.on("replay", function () {
        replay(function (err) {
            engine.initDashboard();
        });
    });

    var app = require("./src/config/express")(viewModelOptions, viewModelRepository, eventBus, cqrs_domainService, cqrs_cmdService);

    startServer(app);
}

function replay(callback) {
    logger.info("replaying events...");

    cqrs_denormalizerService.clear(function (err) {
        if (err) {
            logger.error("clear vms failed: ", err);
            if (callback !== undefined) {
                callback.call(err);
            }
            return;
        }
    });

    cqrs_domainService.eventStore.getEvents(function (err, evts) {
        if (err) {
            logger.error("error on retrieving events: ", err);
            if (callback !== undefined) {
                callback.call(err);
            }
        }
        else {
            var eventPayload = _.map(evts, "payload");
            cqrs_denormalizerService.replay(eventPayload, function (err) {
                if (err) {
                    logger.error("replaying done with error: ", err);
                }
                else {
                    logger.info("replaying done");
                }
                if (callback !== undefined) {
                    callback.call(err);
                }
            });
        }
    });
}

function onInitViewModel(err, repository) {
    if (err) {
        logger.fatal(err);
        process.exit(1);
    }

    viewModelRepository = repository;

    cqrs_denormalizerService.init(onInitDenormalizer);
}

function startServer(app) {
    server = http.createServer(app);
    server.on("error", onError);
    server.on("listening", onListening);
    var io = require("socket.io").listen(server);
    io.on("connection", function (socket) {
        socket.on("event", function (data) {
            logger.info("websocket connection");
        });
        socket.on("disconnect", function () {
            logger.info("websocket disconnected");
        });

        logger.info("client connected: ");
    });

    var drinkRepo = require("./src/viewmodels/drinks/collection").repository;
    engine.setWSIO(io);
    engine.setRepository(drinkRepo);

    replay(function (err) {
        if (err) {
            logger.fatal("replaying done with error: ", err);
            process.exit(1);
        }

        engine.initDashboard();

        server.listen(config.port);

        //engine.activate();
    });
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(err) {
    if (err.syscall !== "listen") {
        throw err;
    }

    var bind = typeof config.port === "string"
        ? "Pipe " + config.port
        : "Port " + config.port;

    // handle specific listen errors with friendly messages
    switch (err.code) {
        case "EACCES":
            logger.fatal(bind + " requires elevated privileges", err);
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.fatal(bind + " is already in use", err);
            process.exit(1);
            break;
        case "ECONNREFUSED":
            logger.fatal(bind + " is already in use", err);
            process.exit(1);
            break;
        default:
            throw err;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    logger.info("Listening on " + bind)
}


function onInitDomain(err) {
    if (err) {
        logger.fatal(err);
        process.exit(1);
    }

    logger.info(JSON.stringify(cqrs_domainService.getInfo(), null, 2));

    // on receiving a message (__=command__) from emitter pass it to
    // the domain calling the handle function
    logger.info("onInitDomain - hook on commands");
    cqrs_cmdService.on("command", function (cmd) {
        logger.info("domain -- received command " + cmd.name + " from emitter", cmd);
        cqrs_domainService.handle(cmd, function (err) {
            if (err) {
                logger.error("command error: ", err);
            }
            else {
                logger.info("command handled: " + cmd.name);
            }
        });
    });

    // on receiving a message (__=event) from domain pass it to the event-bus
    logger.info("onInitDomain - hook on domain-events");
    cqrs_domainService.onEvent(function (evt) {
        logger.info("domain-event -> event-bus: " + evt.name, evt);
        eventBus.emit("domain-event", evt);
    });

    bootstrapViewModel();
}

function bootstrapDomain() {
    logger.info("bootstrapping domain...");
    cqrs_domainService.init(onInitDomain);
}

function bootstrapViewModel() {
    logger.info("bootstrapping viewModel...");
    cqrs_viewmodel.read(viewModelOptions.repository, onInitViewModel);
}

var cqrs_domainService = cqrs_domain(domainOptions);
var cqrs_denormalizerService = cqrs_denormalizer(viewModelOptions);
var cqrs_cmdService = cqrs_eventedCmd();

// make sure to clone all the definitions since they might get overwritten otherwise...
cqrs_domainService.defineCommand(_.clone(defaultCmdDefinition));
cqrs_domainService.defineEvent(_.clone(defaultEvtDefinition));
cqrs_cmdService.defineCommand(_.clone(defaultCmdDefinition));
cqrs_cmdService.defineEvent(_.clone(defaultEvtDefinition));
cqrs_denormalizerService.defineEvent(_.clone(defaultEvtDefinition));

// start the whole thing up...
bootstrapDomain();
