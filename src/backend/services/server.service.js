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

function startServer(clear, populate, callback) {
    logger.info("starting the server");

    var bootstrap = [
        function (callback) {
            systemService.init(clear, populate, callback);
        },
        function (callback) {
            webSocketService.init(server, callback);
        }
    ];

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

                    var startupString = "server started";
                    if (clear && populate) {
                        startupString += " (cleared & populated)"
                    }
                    else if (clear) {
                        startupString += " (cleared)"
                    }
                    else if (populate) {
                        startupString += " (populated)"
                    }
                    else {
                        startupString += " (default)"
                    }

                    logger.info(startupString + " -> listening on " + bind)
                    callback(null);
                }
            });
        }
    });
}

function stopServer(callback) {
    logger.info("stoping the server");

    server.close(function (err) {
        logger.info("server stopped");
        callback(err);
    });
}

module.exports = {
    startServer: startServer,
    stopServer: stopServer,
    server: server
};

