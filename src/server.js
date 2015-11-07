/**
 * Created by Stefano on 11.10.2015.
 */
"use strict";

var _ = require("lodash");
var logger = require("./backend/utils/logger");
var serverService = require("./backend/services/server.service");


var doClear = _.includes(process.argv, "--clear");
var doPopulate = _.includes(process.argv, "--populate");

serverService.startServer(doClear, doPopulate, function (err) {
    if (err) {
        logger.error("error while starting server\n", err);
        process.exit(1);
    }
    else {
    }
});