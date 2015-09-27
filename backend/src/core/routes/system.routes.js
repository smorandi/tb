/**
 * Created by Stefano on 25.07.2015.
 */
"use strict";

var logger = require("../../config/logger");
var config = require("../../config/config");
var SystemController = require("../controllers/system.controller");
var requireLogin = require("../services/auth.service.js").requireLogin;
var requireAdmin = require("../services/auth.service.js").requireAdmin;
var router = require("express").Router();

function init(app) {
    logger.trace("initializing system routes...");

    app.use(config.urls.system, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin, requireAdmin);

    var controller = new SystemController();

    router.route("/")
        .get(function (req, res, next) {
            return controller.getAsResource(req, res, next);
        })
        .put(function (req, res, next) {
            return controller.changePriceReductionInterval(req, res, next);
        });

    router.route("/replays").post(function (req, res, next) {
        return controller.replay(req, res, next);
    });

    router.route("/engineStarts").put(function (req, res, next) {
        return controller.startEngine(req, res, next);
    });

    router.route("/engineStops").put(function (req, res, next) {
        return controller.stopEngine(req, res, next);
    });

    router.route("/reinitializations").post(function (req, res, next) {
        return controller.reInitialize(req, res, next);
    });
}

module.exports = init;