"use strict";

var http = require("http");
var path = require("path");
var _ = require("lodash");
var async = require("async");
var app = require("./src/config/express")();

var domainService = require("./src/core/services/domain.service.js");
var denormalizerService = require("./src/core/services/denormalizer.service.js");
var sagaService = require("./src/core/services/saga.service.js");
var webSocketService = require("./src/core/services/websocket.service.js");

var systemService = require("./src/core/services/system.service.js");
var logger = require("./src/config/logger");
var config = require("./src/config/config");
var utils = require("./src/config/utils");
var server = http.createServer(app);

var bootstrap = [
    function (callback) {
        logger.info("initialize the system...");
        systemService.init(callback);
    },
    function (callback) {
        logger.info("initialize websocket-service...");
        webSocketService.init(server, callback);
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