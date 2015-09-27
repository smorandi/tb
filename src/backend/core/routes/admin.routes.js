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
var adminsCollection = require("../../cqrs/viewmodels/admins/collection");
var commandService = require("../../services/command.service.js");
var requireLogin = require("../../services/auth.service.js").requireLogin;
var requireAdmin = require("../../services/auth.service.js").requireAdmin;
var requireMatchingUserId = require("../../services/auth.service.js").requireMatchingUserId;

function init(app) {
    logger.trace("initializing admin routes...");
    app.use(config.urls.admins, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin, requireAdmin);

    router.route("/")
        .get(function (req, res, next) {
            adminsCollection.findViewModels({}, function (err, docs) {
                if (err) {
                    return next(err);
                }
                else if (_.isEmpty(docs)) {
                    return res.json([]);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.admins);
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
            commandService.send("createAdmin").for("user").with({payload: req.body}).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(202).end();
                });
            });
        });

    router.route("/:id")
        .get(function (req, res, next) {
            adminsCollection.findViewModels({id: req.params.id}, function (err, docs) {
                if (err) {
                    return next(err);
                }
                else if (_.isEmpty(docs)) {
                    return res.status(404).end();
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.admins + "/" + req.params.id);
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
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.admins);
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