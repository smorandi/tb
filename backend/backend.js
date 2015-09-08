var http = require("http");
var logger = require("./src/config/logger");
var eventBus = require("./src/emitter/emitter");
var config = require("./src/config/config");
var viewmodel = require("viewmodel");
var utils = require("./src/config/utils");
var path = require("path");
var evtCmd = require("evented-command")();

var server;

var domain = require("cqrs-domain")({
    domainPath: __dirname + "/src/domain",
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
    name: "command",
    aggregateId: "aggregate.id",
    payload: "payload",
    //revision: "payload._revision"
};

var evtDefinition = {
    correlationId: "commandId",
    id: "id",
    name: "event",
    aggregateId: "aggregate.id",
    payload: "payload",
    //revision: "payload._revision"
};

domain.defineCommand(cmdDefinition);
domain.defineEvent(evtDefinition);
evtCmd.defineCommand(cmdDefinition);
evtCmd.defineEvent(evtDefinition);

domain.init(function (err) {
    if (err) {
        return logger.error(err);
    }

    logger.info(JSON.stringify(domain.getInfo(), null, 2));

    // on receiving a message (__=command__) from emitter pass it to
    // the domain calling the handle function
    logger.info("hook on commands");
    evtCmd.on("command", function (cmd) {
        logger.info("domain -- received command " + cmd.command + " from emitter");
        logger.info("", cmd);
        logger.info("handling command: " + cmd.command);
        domain.handle(cmd, function (err) {
            if (err) {
                logger.error("command error: ", err);
            }
            else {
                logger.info("command handled: " + cmd.command);
            }
        });
    });

    // on receiving a message (__=event) from domain pass it to the emitter
    logger.info("hook on domain-events");
    domain.onEvent(function (evt) {
        logger.info("domain: " + evt.event);
        eventBus.emit("domain-event", evt);
    });

    logger.info("Starting domain service");
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
    var eventDenormalizer = require("cqrs-eventdenormalizer")(options);

    eventDenormalizer.defineEvent({
        correlationId: "commandId",
        id: "id",
        name: "event",
        aggregateId: "aggregate.id",
        payload: "payload",
        aggregate: "aggregate.name",
        //revision: "payload._revision",
    });

    eventDenormalizer.init(function (err) {
        if (err) {
            logger.error(err);
        }

        logger.info(JSON.stringify(eventDenormalizer.getInfo(), null, 2));

        eventBus.on("domain-event", function (data) {
            logger.info("eventDenormalizer -- denormalize event " + data.event);
            eventDenormalizer.handle(data);
        });

        eventDenormalizer.onEvent(function (evt) {
            logger.info("eventDenormalizer.onEvent(): ", evt);
            evtCmd.emit("event", evt);
        });

        // SETUP COMMUNICATION CHANNELS

        eventBus.on("replay", function () {
            eventDenormalizer.clear(function (err) {
            });

            domain.eventStore.getEvents(function (err, evts) {
                for (var i = 0; i < evts.length; i++) {
                    var evt = evts[i];
                    logger.info(evt);
                    eventBus.emit("domain-event", evt.payload);
                }
            });
        });


        // START LISTENING
        var app = require("./src/config/express")(options, repository, eventBus, domain, evtCmd);
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