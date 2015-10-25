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

var requireLogin = require("../middlewares/auth.middleware").requireLogin;
var requireAdmin = require("../middlewares/auth.middleware").requireAdmin;
var requireMatchingUserId = require("../middlewares/auth.middleware").requireMatchingUserId;

var pricingCollection = require("../../cqrs/viewmodels/pricing/collection");

module.exports = function (app) {
    logger.trace("initializing pricing routes...");

    app.use(config.urls.pricing, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin, requireAdmin);

    router.route("/")
        .get(function (req, res, next) {
            pricingCollection.findViewModels({}, function (err, docs) {
                res.json(_.invoke(docs, "toJSON"));
            });
        });
}