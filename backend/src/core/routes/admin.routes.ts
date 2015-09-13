/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import logger = require("../../config/logger");
import config = require("../../config/config");
var hal = require("halberd");

function init(app, options, repository, eventBus) {
    logger.trace("initializing admin routes...")

    app.route("/admin/replay").post((req, res, next) => {
        eventBus.emit("replay");
        res.end();
    });
}

export = init;
