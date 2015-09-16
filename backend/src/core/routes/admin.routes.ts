/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import logger = require("../../config/logger");
import AdminController = require("../controllers/admin.controller");

function init(app) {
    logger.trace("initializing admin routes...")

    var controller = new AdminController();

    app.route("/admin").get((req, res, next) => controller.getAsResource(req, res, next));
    app.route("/admin/replays").post((req, res, next) => controller.replay(req, res, next));
    app.route("/admin/activations").put((req, res, next) => controller.activateEngine(req, res, next));
    app.route("/admin/deactivations").put((req, res, next) => controller.deactivateEngine(req, res, next));
}

export = init;
