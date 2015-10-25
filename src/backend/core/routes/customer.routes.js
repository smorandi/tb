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

var requireLogin = require("../middlewares/auth.middleware").requireLogin;
var requireAdmin = require("../middlewares/auth.middleware").requireAdmin;
var requireMatchingUserId = require("../middlewares/auth.middleware").requireMatchingUserId;
var requireMatchingUserIdByKey = require("../middlewares/auth.middleware").requireMatchingUserIdByKey;

var customersCollection = require("../../cqrs/viewmodels/customers/collection");

module.exports = function (app) {
    logger.trace("initializing customer routes...");

    app.use(config.urls.customers, router);

    // authentication middleware defaults for this router...
    // NO defaults for this router!

    router.route("/")
        .get(requireLogin, requireAdmin, function (req, res, next) {
            customersCollection.findViewModels({}, function (err, docs) {
                if (err) {
                    next(err);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers);
                    res.form(resourceUtils.createCollectionResource(baseUrl, docs, "c", "ud"), docs);
                }
            });
        })
        .post(function (req, res, next) {
            commandService.send("createCustomer").for("user").with({payload: req.body}).go(res.handleEvent(function (evt) {
                res.status(202).end();
            }));
        });

    router.route("/:id")
        .get(requireLogin, requireMatchingUserIdByKey("id"), function (req, res, next) {
            customersCollection.findViewModels({id: req.params.id}, {limit: 1}, function (err, docs) {
                if (err) {
                    next(err);
                }
                else if (_.isEmpty(docs)) {
                    next(new HTTPErrors.NotFoundError("User with id '%s' not found", req.params.id));
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers + "/" + req.params.id);
                    res.form(resourceUtils.createResource(baseUrl, docs[0], "ud"), docs[0]);
                }
            });
        })
        .put(requireLogin, requireMatchingUserIdByKey("id"), function (req, res, next) {
            commandService.send("changeUser").for("user").instance(req.params.id).with({payload: req.body}).go(res.handleEvent(function (evt) {
                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers);
                res.form(resourceUtils.createResource(baseUrl, evt.payload, "ud"), evt.payload);
            }));
        })
        .delete(requireLogin, requireMatchingUserIdByKey("id"), function (req, res, next) {
            commandService.send("deleteUser").for("user").instance(req.params.id).go(res.handleEvent(function (evt) {
                res.status(204).end();
            }));
        });
}