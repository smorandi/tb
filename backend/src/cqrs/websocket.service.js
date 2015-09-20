/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";

var _ = require("lodash");
var config = require("../config/config");
var logger = require("../config/logger");

var socketIO = require("socket.io");

var webSocket;

function getWebSocket() {
    return webSocket;
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


function broadcast(channel, data) {
    webSocket.sockets.emit(channel, data);
}

function init(server, callback) {
    logger.debug("initializing websocket-service...");
    webSocket = socketIO.listen(server);
    webSocket.on("connection", onWebsocketConnection);
    callback(null);
}

module.exports = {init: init, broadcast: broadcast, getWebSocket: getWebSocket};
