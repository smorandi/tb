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
var pricingCollection = require("../../cqrs/viewmodels/pricing/collection");

function init(app) {
    logger.trace("initializing dashboard routes...");

    app.route("/pricing")
        .get((req, res, next) => {
            res.format({
                "application/json": () => {
                    pricingCollection.findViewModels({}, function (err, docs) {
                        res.json(_.invoke(docs, "toJSON"))
                    })
                }
            });
        })
}

export = init;