/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import logger = require("../../config/logger");
import config = require("../../config/config");
import HomeController = require("../controllers/home.controller");

function init(app) {
    logger.trace("initializing home routes...")

    var controller = new HomeController();

    app.route(config.urls.home).get((req, res, next) => controller.getAsResource(req, res, next));
}

export = init;
