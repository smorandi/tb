/**
 * Created by Stefano on 25.07.2015.
 */
"use strict";
var logger = require("../../config/logger");
var config = require("../../config/config");
var HomeController = require("../controllers/home.controller");
var requireLogin = require("../services/auth.service.js").requireLogin;
var requireAdmin = require("../services/auth.service.js").requireAdmin;
var router = require("express").Router();

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