/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import logger = require("../../config/logger");
import config = require("../../config/config");
import SystemController = require("../controllers/system.controller");

function init(app) {
    logger.trace("initializing system routes...")

    var controller = new SystemController();

    app.route(config.urls.system).get((req, res, next) => controller.getAsResource(req, res, next));
    app.route(config.urls.system).put((req, res, next) => controller.updateEngine(req, res, next));
    app.route(config.urls.system + "/replays").post((req, res, next) => controller.replay(req, res, next));
    app.route(config.urls.system + "/activations").put((req, res, next) => controller.activateEngine(req, res, next));
    app.route(config.urls.system + "/deactivations").put((req, res, next) => controller.deactivateEngine(req, res, next));
}

export = init;
