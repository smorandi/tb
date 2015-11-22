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
var usersCollection = require("../../cqrs/viewmodels/users/collection");
var commandService = require("../../services/command.service.js");

var requireLogin = require("../middlewares/auth.middleware").requireLogin;
var requireAdmin = require("../middlewares/auth.middleware").requireAdmin;
var requireRoot = require("../middlewares/auth.middleware").requireRoot;
var requireMatchingUserId = require("../middlewares/auth.middleware").requireMatchingUserId;

module.exports = function (app) {
    logger.trace("initializing user routes...");
    app.use(config.urls.users, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin, requireRoot);

    router.route("/")
        .get(function (req, res, next) {
            usersCollection.findViewModels({}, function (err, docs) {
                if (err) {
                    next(err);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.users);
                    res.form(resourceUtils.createCollectionResource(baseUrl, docs, "", "ud"), docs);
                }
            });
        });

    router.route("/:id")
        .get(function (req, res, next) {
            usersCollection.findViewModels({id: req.params.id}, {limit: 1}, function (err, docs) {
                if (err) {
                    return next(err);
                }
                else if (_.isEmpty(docs)) {
                    next(new HTTPErrors.NotFoundError("User with id '%s' not found", req.params.id));
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.users + "/" + req.params.id);
                    res.form(resourceUtils.createResource(baseUrl, docs[0]), docs[0], "ud");
                }
            });
        })
        .put(function (req, res, next) {
            commandService.send("changeUser").for("user").instance(req.params.id).with({payload: req.body}).go(res.handleEvent(function (evt) {
                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.users);
                res.form(resourceUtils.createResource(baseUrl, evt.payload, "ud"), evt.payload);
            }));
        })
        .delete(function (req, res, next) {
            commandService.send("deleteUser").for("user").instance(req.params.id).go(res.handleEvent(function (evt) {
                res.status(204).end();
            }));
        });
}