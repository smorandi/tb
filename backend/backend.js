"use strict";

var http = require("http");
var path = require("path");
var _ = require("lodash");
var async = require("async");
var app = require("./src/config/express")();

var domainService = require("./src/cqrs/domainService");
var denormalizerService = require("./src/cqrs/denormalizerService");
var viewmodelService = require("./src/cqrs/viewmodelService");

var logger = require("./src/config/logger");
var eventBus = require("./src/core/utils/eventBus");
var config = require("./src/config/config");
var utils = require("./src/config/utils");
var engine = require("./src/core/engine/engine");
var server = http.createServer(app);
var wsio = require("socket.io").listen(server);


var bootstrap = [
    function (callback) {
        logger.info("initialize domain-service...");
        domainService.init(callback);
    },
    function (callback) {
        logger.info("initialize viewmodel-service...");
        viewmodelService.init(callback);
    },
    function (callback) {
        logger.info("initialize denormalizer-service...");
        denormalizerService.init(callback);
    },
    function (callback) {
        logger.info("replay events...");
        denormalizerService.replay(callback);
    },
    function (callback) {
        logger.info("initialize engine...");
        engine.setWSIO(wsio);
        engine.initDashboard();
        //engine.activate();

        callback(null);
    },
];

logger.info("start bootstrapping...");
async.waterfall(bootstrap, function (err, warnings) {
    if (err) {
        logger.error("bootstrap errors", err);
    }
    else if (warnings) {
        logger.warn("bootstrap warnings", warnings);
    }
    else {
        logger.info("bootstrapping finished");
        initListeners();
        server.listen(config.port);
    }
});


function initListeners() {
    server.on("error", onServerError);
    server.on("listening", onServerListening);
    wsio.on("connection", onWebsocketConnection);
}

function onWebsocketConnection(socket) {
    socket.on("event", function (data) {
        logger.debug("websocket connection");
    });
    socket.on("disconnect", function () {
        logger.debug("websocket disconnected");
    });

    logger.debug("client connected: ");
}

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