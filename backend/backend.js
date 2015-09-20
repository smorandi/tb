"use strict";

var http = require("http");
var path = require("path");
var _ = require("lodash");
var async = require("async");
var app = require("./src/config/express")();

var domainService = require("./src/cqrs/domain.service");
var denormalizerService = require("./src/cqrs/denormalizer.service");
var sagaService = require("./src/cqrs/saga.service");
var webSocketService = require("./src/cqrs/websocket.service");
var commandService = require("./src/cqrs/command.service");

var logger = require("./src/config/logger");
var eventBus = require("./src/core/utils/eventBus");
var config = require("./src/config/config");
var utils = require("./src/config/utils");
var engine = require("./src/core/engine/engine");
var server = http.createServer(app);


var bootstrap = [
    function (callback) {
        logger.info("initialize domain-service...");
        domainService.init(callback);
    },
    function (callback) {
        logger.info("initialize denormalizer-service...");
        denormalizerService.init(callback);
    },
    function (callback) {
        logger.info("initialize saga-service...");
        sagaService.init(callback);
    },
    function (callback) {
        logger.info("replay events...");
        denormalizerService.replay(callback);
    },
    function (callback) {
        logger.info("initialize websocket-service...");
        webSocketService.init(server, callback);
    },
    function (callback) {
        logger.info("deactivate engine...");
        engine.deactivate(callback);
    },
    function (callback) {
        logger.info("reset prices...");
        engine.resetPrices(callback);
    }
];

logger.info("start bootstrapping...");
async.series(bootstrap, function (err) {
    if (err) {
        logger.error("bootstrap errors", err);
        process.exit(1);
    }
    else {
        logger.info("bootstrapping finished");
        server.on("error", onServerError);
        server.on("listening", onServerListening);
        server.listen(config.port);
    }
});

/**
 * Event listener for HTTP server "error" event.
 */
function onServerError(err) {
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
            logger.fatal(bind + " refuses connection (already in use?)", err);
            process.exit(1);
            break;
        default:
            throw err;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onServerListening() {
    var addr = server.address();
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    logger.info("Listening on " + bind)
}