/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require('express');
import logger = require("../../config/logger");
import controller = require("../controllers/drinks.controller");

function init(app) {
    logger.trace("initializing drink routes...")

    app.route('/drinks')
        .get((req, res, next) => controller.list(req, res, next))
        .post((req, res, next) => controller.create(req, res, next));

    app.route('/drinks/:id')
        .get((req, res, next) => controller.read(req, res, next))
        .put((req, res, next) => controller.update(req, res, next))
        .delete((req, res, next) => controller.delete(req, res, next))

    //app.param("id", (req, res, next, id) => controller.resolveById(req, res, next, id));
}

export = init;