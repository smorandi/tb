/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";

var _ = require("lodash");
var config = require("../config");
var logger = require("../utils/logger");

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

    logger.debug("client connected");
}


function broadcast(channel, data) {
    // check as this might be called even before the service has actually been initialized...
    if (webSocket) {
        webSocket.sockets.emit(channel, data);
    }
    else {
        logger.warn("trying to broadcast before socket has been initialized");
    }
}

function init(server, callback) {
    logger.info("initialize websocket-service");
    webSocket = socketIO.listen(server);
    webSocket.on("connection", onWebsocketConnection);
    callback(null);
}

module.exports = {init: init, broadcast: broadcast, getWebSocket: getWebSocket};