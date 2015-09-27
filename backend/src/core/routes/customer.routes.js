/**
 * Created by Stefano on 24.07.2015.
 */
"use strict";
var _ = require("lodash");
var logger = require("../../config/logger");
var config = require("../../config/config");
var resourceUtils = require("../utils/resourceUtils");
var hal = require("halberd");
var customersCollection = require("../../cqrs/viewmodels/customers/collection");
var commandService = require("../services/command.service.js");
var requireLogin = require("../services/auth.service.js").requireLogin;
var requireAdmin = require("../services/auth.service.js").requireAdmin;
var requireMatchingUserId = require("../services/auth.service.js").requireMatchingUserId;
var router = require("express").Router();

function init(app) {
    logger.trace("initializing customer routes...");

    app.use(config.urls.customers, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin);
    router.param("id", requireMatchingUserId);

    router.route("/")
        .get(requireAdmin, function (req, res, next) {
            customersCollection.findViewModels({}, function (err, docs) {
                if (err) {
                    return next(err);
                }
                else if (_.isEmpty(docs)) {
                    return res.json([]);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers);
                    res.format({
                        "application/hal+json": function () {
                            return res.json(resourceUtils.createCollectionResource(baseUrl, docs, "c", "ud"));
                        },
                        "application/json": function () {
                            return res.json(docs);
                        }
                    });
                }
            });
        })
        .post(function (req, res, next) {
            commandService.send("createCustomer").for("user").with({payload: req.body}).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(202).end();
                });
            });
        });

    router.route("/:id")
        .get(requireMatchingUserId, function (req, res, next) {
            customersCollection.findViewModels({id: req.params.id}, function (err, docs) {
                if (err) {
                    return next(err);
                }
                else if (_.isEmpty(docs)) {
                    return res.status(404).end();
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers + "/" + req.params.id);
                    res.format({
                        "application/hal+json": function () {
                            return res.json(resourceUtils.createResource(baseUrl, docs[0], "ud"));
                        },
                        "application/json": function () {
                            return res.json(docs[0]);
                        }
                    });
                }
            });
        })
        .put(function (req, res, next) {
            commandService.send("changeUser").for("user").instance(req.params.id).with({payload: req.body}).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers);
                    res.format({
                        "application/hal+json": function () {
                            return res.json(resourceUtils.createResource(baseUrl, evt.payload, "ud"));
                        },
                        "application/json": function () {
                            return res.json(evt.payload);
                        }
                    });
                });
            });
        })
        .delete(function (req, res, next) {
            commandService.send("deleteUser").for("user").instance(req.params.id).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(204).end();
                });
            });
        });
}

module.exports = init;