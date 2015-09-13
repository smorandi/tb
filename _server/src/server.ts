/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />
"use strict";

/**
 * Module dependencies.
 */
import http = require("http");
import mongoose = require("mongoose");
import config = require("./config/config");
import app = require("./config/express");
import logger = require("./config/logger");
import engine = require("./core/engine/Engine");

var db = mongoose.connect(config.db.uri, config.db.options, err => {
    if (err) {
        logger.error("Could not connect to MongoDB!", err);
    }
});
mongoose.connection.on("error", err => {
        logger.fatal("MongoDB connection error: ", err);
        process.exit(-1);
    }
);
mongoose.connection.on("connected", () => logger.info('Mongoose default connection open to ' + config.db.uri));

app.set("port", config.port);

var server = http.createServer(app);

server.listen(config.port);
server.on("error", onError);
server.on("listening", onListening);

var io:SocketIO.Server = require("socket.io").listen(server);
engine.setIO(io);

io.on("connection", function (socket:SocketIO.Socket) {
    socket.on("event", function (data) {
        logger.info("websocket connection");
    });
    socket.on("disconnect", function () {
        logger.info("websocket disconnected");
    });

    logger.info("client connected: ");
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