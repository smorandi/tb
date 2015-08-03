/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require('express');
import logger = require("../../config/logger");
import controller = require("../controllers/users.controller");

function init(app) {
    logger.trace("initializing user routes...")

    app.route('/users')
        .get((req, res, next) => controller.list(req, res, next))
        .post((req, res, next) => controller.create(req, res, next));

    app.route('/users/:id')
        .get((req, res, next) => controller.read(req, res, next))
        .put((req, res, next) => controller.update(req, res, next))
        .delete((req, res, next) => controller.delete(req, res, next))
}

export = init;