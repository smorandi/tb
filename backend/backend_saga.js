var http = require("http");
var logger = require("./src/config/logger");
var eventBus = require("./src/core/utils/eventBus");
var config = require("./src/config/config");
var viewmodel = require("viewmodel");
var utils = require("./src/config/utils");
var path = require("path");
var cmdSrv = require("evented-command")();

var server;


var domain = require("cqrs-domain")({
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
});

var cmdDefinition = {
    id: "id",
    name: "name",
    aggregate: "aggregate.name",
    aggregateId: "aggregate.id",
    payload: "payload",

    revision: "aggregate.revision"
};

var evtDefinition = {
    correlationId: "commandId",
    id: "id",
    name: "name",
    aggregate: "aggregate.name",
    aggregateId: "aggregate.id",
    payload: "payload",
    revision: "aggregate.revision"
};

domain.defineCommand(cmdDefinition);
domain.defineEvent(evtDefinition);
cmdSrv.defineCommand(cmdDefinition);
cmdSrv.defineEvent(evtDefinition);

domain.init(function (err) {
    if (err) {
        return logger.error(err);
    }

    logger.info(JSON.stringify(domain.getInfo(), null, 2));

    // on receiving a message (__=command__) from emitter pass it to
    // the domain calling the handle function
    logger.info("hook on commands");
    cmdSrv.on("command", function (cmd) {
        logger.info("domain -- received command " + cmd.name + " from emitter", cmd);
        logger.info("handling command: " + cmd.name);
        domain.handle(cmd, function (err) {
            if (err) {
                logger.error("command error: ", err);
            }
            else {
                logger.info("command handled: " + cmd.name);
            }
        });
    });

    // on receiving a message (__=event) from domain pass it to the emitter
    logger.info("hook on domain-events");
    domain.onEvent(function (evt) {
        logger.info("domain-event -> event-bus: " + evt.name, evt);
        eventBus.emit("domain-event", evt);
        //logger.info("domain-event -> pm -> handle: " + evt.name, evt);
        //pm.handle(evt);
    });

    logger.info("Starting domain service");

    //var pm = require("cqrs-saga")({
    //    sagaPath: __dirname + "/src/domain/sagas",
    //
    //    //sagaStore: {
    //    //    type: "mongodb",
    //    //    host: "localhost",                          // optional
    //    //    port: 27017,                                // optional
    //    //    dbName: "domain",                           // optional
    //    //    collectionName: "sagas",                    // optional
    //    //    timeout: 10000                              // optional
    //    //},
    //});
    //
    //pm.defineCommand({
    //    id: "id",
    //    meta: "meta"
    //});
    //
    //pm.defineEvent({
    //    name: "name",
    //    aggregate: "aggregate.name",
    //    aggregateId: "aggregate.id",
    //    revision: "aggregate.revision"
    //});
    //
    //pm.init(function (err) {
    //    if (err) {
    //        return logger.error(err);
    //    }
    //
    //    logger.info(JSON.stringify(pm.getInfo(), null, 2));
    //
    //    pm.onCommand(function (cmd) {
    //        domain.handle(cmd, function (err) {
    //            if (err) {
    //                logger.error("command error: ", err);
    //            }
    //            else {
    //                logger.info("command handled: " + cmd.name);
    //            }
    //        });
    //    });
    //});
});


var options = {
    denormalizerPath: __dirname + "/src/viewmodels",
    repository: {
        type: "inMemory",
        dbName: "query"
    },
    revisionGuardStore: {
        type: "inMemory",
        dbName: "query"
    }
};

viewmodel.read(options.repository, function (err, repository) {
    var denormalizer = require("cqrs-eventdenormalizer")(options);

    denormalizer.defineEvent({
        correlationId: "commandId",
        id: "id",
        name: "name",
        aggregate: "aggregate.name",
        aggregateId: "aggregate.id",
        payload: "payload",
        revision: "aggregate.revision"
    });

    denormalizer.init(function (err) {
        if (err) {
            logger.error(err);
        }

        logger.info(JSON.stringify(denormalizer.getInfo(), null, 2));

        eventBus.on("domain-event", function (evt) {
            logger.info("event-bus -> denormalizer -> handle():  " + evt.name, evt);
            denormalizer.handle(evt);
        });

        denormalizer.onEvent(function (evt) {
            logger.info("denormalizer -> cmd-service: " + evt.name, evt);
            cmdSrv.emit("event", evt);
        });

        // SETUP COMMUNICATION CHANNELS

        eventBus.on("replay", function () {
            denormalizer.clear(function (err) {
            });

            domain.eventStore.getEvents(function (err, evts) {
                for (var i = 0; i < evts.length; i++) {
                    var evt = evts[i];
                    logger.info("emitting stored event to event-bus: " + evt.payload.name, evt);
                    eventBus.emit("domain-event", evt.payload);
                }
            });
        });


        // START LISTENING
        var app = require("./src/config/express")(options, repository, eventBus, domain, cmdSrv);
        server = http.createServer(app);
        server.listen(config.port);
        server.on("error", onError);
        server.on("listening", onListening);
    });
});

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