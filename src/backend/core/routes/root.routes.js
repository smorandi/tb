/**
 * Created by Stefano on 25.07.2015.
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

module.exports = function (app) {
    logger.trace("initializing root routes...");

    app.use(config.urls.root, router);

    router.route("/")
        .get(function (req, res, next) {
            var root = resourceUtils.createBaseUrl(req, "");
            var resource = new hal.Resource({}, root + config.urls.root);
            resource.link("dashboard", root + config.urls.dashboard);
            resource.link("home", root + config.urls.home);
            resource.link("register", root + config.urls.customers);

            res.form(resource);
        });
}