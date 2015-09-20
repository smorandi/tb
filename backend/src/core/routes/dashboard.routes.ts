/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import _ = require("lodash");
import logger = require("../../config/logger");
import config = require("../../config/config");
import resourceUtils = require("../utils/resourceUtils");
import engine = require("../engine/engine");
var dashboardCollection = require("../../cqrs/viewmodels/dashboard/collection");

function init(app) {
    logger.trace("initializing dashboard routes...");

    app.route(config.urls.dashboard)
        .get((req, res, next) => {
            res.format({
                "application/json": () => {
                    dashboardCollection.findViewModels({}, function (err, docs) {
                        var drinks = _.map(docs, (item:any) => item.toJSON());
                        res.json(drinks)
                    })
                }
            });
        })
}

export = init;