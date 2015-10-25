/**
 * Created by Stefano on 24.07.2015.
 */
"use strict";

var _ = require("lodash");
var hal = require("halberd");
var router = require("express").Router();
var HTTPErrors = require("http-custom-errors");

var logger = require("../../utils/logger");
var config = require("../../config");
var resourceUtils = require("../../utils/resourceUtils");
var commandService = require("../../services/command.service.js");
var requireLogin = require("../../services/auth.service.js").requireLogin;
var requireAdmin = require("../../services/auth.service.js").requireAdmin;
var requireMatchingUserId = require("../../services/auth.service.js").requireMatchingUserId;

var dashboardCollection = require("../../cqrs/viewmodels/dashboard/collection");

module.exports = function (app) {
    logger.trace("initializing dashboard routes...");

    app.use(config.urls.dashboard, router);

    router.route("/")
        .get(function (req, res, next) {
            dashboardCollection.findViewModels({}, function (err, docs) {
                err ? next(err) : res.json(_.invoke(docs, "toJSON"));
            });
        });
}