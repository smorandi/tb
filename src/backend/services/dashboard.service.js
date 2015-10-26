/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var webSocketService = require("./websocket.service");
var dashboardCollection = require("../cqrs/viewmodels/dashboard/collection");
var config = require("../config");

var models = require("../core/models");
var logger = require("../utils/logger");
var _ = require("lodash");

function emitDashboard(callback) {
    logger.debug("emitting dashboard...");

    dashboardCollection.findViewModels({}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else if (_.isEmpty(docs)) {
            logger.debug("nothing to emit.");
            callback(null);
        }
        else {
            webSocketService.broadcast(config.websocketChannel_dashboard, _.invoke(docs, "toJSON"));
            callback(null);
        }
    })
}

module.exports = {
    emitDashboard: emitDashboard,
};