/**
 * Created by Stefano on 11.10.2015.
 */
"use strict";

var logger = require("./backend/utils/logger");
var serverService = require("./backend/services/server.service");

logger.info("starting server...");
serverService.startServer(true, function (err) {
    if (err) {
        logger.error("error while starting server\n", err);
        process.exit(1);
    }
    else
    {

    }
});