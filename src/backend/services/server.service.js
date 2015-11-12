/**
 * Created by Stefano on 11.10.2015.
 */
"use strict";

var http = require("http");
var https = require("https");
var path = require("path");
var async = require("async");
var _ = require("lodash");

var express = require("../core/express")();
var logger = require("../utils/logger");
var config = require("../config");
var webSocketService = require("./websocket.service.js");
var systemService = require("./system.service.js");

var server;
switch (config.server.protocol) {
    case "http" :
        server = http.createServer(express);
        break;
    case "https" :
        server = https.createServer(config.server.credentials, express);
        break;
    default:
        break;
}

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
            server.listen(config.server.port, config.server.host, function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    logger.info("server started (cleared: %s, populated: %s) -> listening on port %s using %s protocol",
                        clear, populate, server.address().port, config.server.protocol);
                    logger.info("                                                        _");
                    logger.info("                                                       (_)");
                    logger.info("  ___  ___ _ ____   _____ _ __   _ __ _   _ _ __  _ __  _ _ __   __ _");
                    logger.info(" / __|/ _ \\ '__\\ \\ / / _ \\ '__| | '__| | | | '_ \\| '_ \\| | '_ \\ / _` |");
                    logger.info(" \\__ \\  __/ |   \\ V /  __/ |    | |  | |_| | | | | | | | | | | | (_| |");
                    logger.info(" |___/\\___|_|    \\_/ \\___|_|    |_|   \\__,_|_| |_|_| |_|_|_| |_|\\__, |");
                    logger.info("                                                                 __/ |");
                    logger.info("                                                                |___/ ");

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
    server: server,
};

