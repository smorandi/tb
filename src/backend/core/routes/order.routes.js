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
var requireCustomer = require("../middlewares/auth.middleware").requireCustomer;
var requireMatchingUserId = require("../middlewares/auth.middleware").requireMatchingUserId;

var ordersCollection = require("../../cqrs/viewmodels/orders/collection");

module.exports = function (app) {
    logger.trace("initializing order routes...");

    app.use(config.urls.orders, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin);
    router.param("customerId", requireMatchingUserId);

    router.route("/")
        .get(requireAdmin, function (req, res, next) {
            ordersCollection.findViewModels({}, function (err, docs) {
                if (err) {
                    next(err);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.orders);
                    res.form(resourceUtils.createCollectionResource(baseUrl, docs), docs);
                }
            });
        });

    router.route("/:customerId")
        .get(function (req, res, next) {
            ordersCollection.findViewModels({id: req.params.customerId}, {limit: 1}, function (err, docs) {
                if (err) {
                    next(err);
                }
                else if (_.isEmpty(docs)) {
                    next(new HTTPErrors.NotFoundError("Orders for customer '%s' not found", req.user.loginname));
                }
                else {
                    var orders = docs[0].get("orders");
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.orders + "/" + req.params.customerId);
                    res.form(resourceUtils.createCollectionResource(baseUrl, orders), orders);
                }
            });
        })
        .post(requireCustomer, function (req, res, next) {
            commandService.send("createOrder").for("user").instance(req.params.customerId).go(res.handleEvent(function (evt) {
                res.status(202).end();
            }));
        });
}