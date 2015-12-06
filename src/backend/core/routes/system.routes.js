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

var requireLogin = require("../middlewares/auth.middleware").requireLogin;
var requireAdmin = require("../middlewares/auth.middleware").requireAdmin;
var requireMatchingUserId = require("../middlewares/auth.middleware").requireMatchingUserId;

var SystemController = require("../controllers/system.controller.js");

module.exports = function (app) {
    logger.trace("initializing system routes...");

    app.use(config.urls.system, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin, requireAdmin);

    var controller = new SystemController();

    router.route("/")
        .get(function (req, res, next) {
            controller.handleResponse(req, res, next);
        })
        .put(function (req, res, next) {
            controller.update(req, res, next);
        });

    router.route("/replays").post(function (req, res, next) {
        controller.replay(req, res, next);
    });

    router.route("/engineStarts").put(function (req, res, next) {
        controller.startEngine(req, res, next);
    });

    router.route("/engineStops").put(function (req, res, next) {
        controller.stopEngine(req, res, next);
    });

    router.route("/reinitializations").post(function (req, res, next) {
        controller.reInitialize(req, res, next);
    });
};