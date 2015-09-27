"use strict";

var http = require("http");
var path = require("path");
var _ = require("lodash");
var async = require("async");

var express = require("./backend/core/express")();
var webSocketService = require("./backend/services/websocket.service.js");
var systemService = require("./backend/services/system.service.js");
var logger = require("./backend/utils/logger");
var config = require("./backend/config");
var server = http.createServer(express);

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