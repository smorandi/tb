/**
 * Created by Stefano on 25.07.2015.
 */
"use strict";

var _ = require("lodash");
var hal = require("halberd");
var router = require("express").Router();

var logger = require("../../utils/logger");
var config = require("../../config");
var resourceUtils = require("../../utils/resourceUtils");
var commandService = require("../../services/command.service.js");
var requireLogin = require("../../services/auth.service.js").requireLogin;
var requireAdmin = require("../../services/auth.service.js").requireAdmin;
var requireMatchingUserId = require("../../services/auth.service.js").requireMatchingUserId;

var HomeController = require("../controllers/home.controller.js");

function init(app) {
    logger.trace("initializing home routes...");

    app.use(config.urls.home, router);

    var controller = new HomeController();

    router.route("/")
        .get(function (req, res, next) {
            return controller.getAsResource(req, res, next);
        });
}

module.exports = init;