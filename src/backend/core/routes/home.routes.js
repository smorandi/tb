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

var requireLogin = require("../middlewares/auth.middleware").requireLogin;
var requireAdmin = require("../middlewares/auth.middleware").requireAdmin;
var requireMatchingUserId = require("../middlewares/auth.middleware").requireMatchingUserId;

var HomeController = require("../controllers/home.controller.js");

module.exports =  function(app) {
    logger.trace("initializing home routes...");

    app.use(config.urls.home, router);
    router.use(requireLogin);

    var controller = new HomeController();

    router.route("/")
        .get(function (req, res, next) {
            controller.getAsResource(req, res, next);
        });
}