/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require('express');
import logger = require("../../config/logger");
import controller = require("../controllers/engine.controller");

function init(app) {
    logger.trace("initializing engine routes...")

    app.route('/engine')
        .get((req, res, next) => controller.getAsResource(req, res, next));

    app.route('/engine/activations')
        .put((req, res, next) => controller.activateEngine(req, res, next));

    app.route('/engine/deactivations')
        .put((req, res, next) => controller.deactivateEngine(req, res, next));
}

export = init;