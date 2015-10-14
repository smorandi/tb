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
var requireCustomer = require("../../services/auth.service.js").requireCustomer;
var requireMatchingUserId = require("../../services/auth.service.js").requireMatchingUserId;

var ordersCollection = require("../../cqrs/viewmodels/orders/collection");

function init(app) {
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
                    res.format({
                        "application/hal+json": function () {
                            res.json(resourceUtils.createCollectionResource(baseUrl, docs));
                        },
                        "application/json": function () {
                            res.json(docs);
                        }
                    });
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
                    res.format({
                        "application/hal+json": function () {
                            res.json(resourceUtils.createCollectionResource(baseUrl, orders));
                        },
                        "application/json": function () {
                            res.json(orders);
                        }
                    });
                }
            });
        })
        .post(requireCustomer, function (req, res, next) {
            commandService.send("createOrder").for("user").instance(req.params.customerId).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(202).end();
                });
            });
        });
}

module.exports = init;