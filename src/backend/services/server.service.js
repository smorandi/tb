/**
 * Created by Stefano on 11.10.2015.
 */
"use strict";

var http = require("http");
var path = require("path");
var async = require("async");
var _ = require("lodash");

var express = require("../core/express")();
var logger = require("../utils/logger");
var config = require("../config");
var server = http.createServer(express);
var webSocketService = require("./websocket.service.js");
var systemService = require("./system.service.js");

function startServer(reInit, callback) {
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

    if (reInit) {
        bootstrap.push(
            function (callback) {
                logger.info("re-initialize system...");
                systemService.reInit(callback);
            });
    }

    async.series(bootstrap, function (err) {
        if (err) {
            callback(err);
        }
        else {
            server.listen(config.server.port, config.server.host, config.server.backlog, function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    var addr = server.address();
                    var bind = typeof addr === "string"
                        ? "pipe " + addr
                        : "port " + addr.port;
                    logger.info("                                                        _");
                    logger.info("                                                       (_)");
                    logger.info("  ___  ___ _ ____   _____ _ __   _ __ _   _ _ __  _ __  _ _ __   __ _");
                    logger.info(" / __|/ _ \\ '__\\ \\ / / _ \\ '__| | '__| | | | '_ \\| '_ \\| | '_ \\ / _` |");
                    logger.info(" \\__ \\  __/ |   \\ V /  __/ |    | |  | |_| | | | | | | | | | | | (_| |");
                    logger.info(" |___/\\___|_|    \\_/ \\___|_|    |_|   \\__,_|_| |_|_| |_|_|_| |_|\\__, |");
                    logger.info("                                                                 __/ |");
                    logger.info("                                                                |___/ ");
                    logger.info("server running. listening on " + bind)
                    callback(null);
                }
            });
        }
    });
}

function stopServer(callback) {
    server.close(callback);
}

module.exports = {
    startServer: startServer,
    stopServer: stopServer,
    server: server
};

