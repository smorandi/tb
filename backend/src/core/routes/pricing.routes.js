/**
 * Created by Stefano on 24.07.2015.
 */
"use strict";

var _ = require("lodash");
var logger = require("../../config/logger");
var config = require("../../config/config");
var pricingCollection = require("../../cqrs/viewmodels/pricing/collection");

var requireLogin = require("../services/auth.service.js").requireLogin;
var requireAdmin = require("../services/auth.service.js").requireAdmin;
var router = require("express").Router();

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