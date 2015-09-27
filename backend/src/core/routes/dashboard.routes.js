/**
 * Created by Stefano on 24.07.2015.
 */
"use strict";

var _ = require("lodash");
var logger = require("../../config/logger");
var config = require("../../config/config");
var dashboardCollection = require("../../cqrs/viewmodels/dashboard/collection");
var router = require("express").Router();

function init(app) {
    logger.trace("initializing dashboard routes...");

    app.use(config.urls.dashboard, router);

    router.route("/")
        .get(function (req, res, next) {
            res.format({
                "application/json": function () {
                    dashboardCollection.findViewModels({}, function (err, docs) {
                        err ? next(err) : res.json(_.invoke(docs, "toJSON"));
                    });
                }
            });
        });
}
module.exports = init;