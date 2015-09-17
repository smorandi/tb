/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import logger = require("../../config/logger");
import config = require("../../config/config");
import resourceUtils = require("../utils/resourceUtils");
import engine = require("../engine/engine");

function init(app) {
    logger.trace("initializing dashboard routes...");

    app.route(config.urls.dashboard)
        .get((req, res, next) => {
            res.format({
                "application/json": () =>  res.json(engine.dashboard)
            });
        })
}

export = init;