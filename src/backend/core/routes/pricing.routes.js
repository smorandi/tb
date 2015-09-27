/**
 * Created by Stefano on 24.07.2015.
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

var pricingCollection = require("../../cqrs/viewmodels/pricing/collection");

function init(app) {
    logger.trace("initializing pricing routes...");

    app.use(config.urls.pricing, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin, requireAdmin);

    router.route("/")
        .get(function (req, res, next) {
            res.format({
                "application/json": function () {
                    pricingCollection.findViewModels({}, function (err, docs) {
                        res.json(_.invoke(docs, "toJSON"));
                    });
                }
            });
        });
}

module.exports = init;