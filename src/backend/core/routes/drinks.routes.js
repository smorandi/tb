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

var drinksCollection = require("../../cqrs/viewmodels/drinks/collection");

function init(app) {
    logger.trace("initializing drink routes...");

    app.use(config.urls.drinks, router);

    //// authentication middleware defaults for this router...
    router.use(requireLogin, requireAdmin);

    router.route("/")
        .get(function (req, res, next) {
            drinksCollection.findViewModels({}, function (err, docs) {
                if (err) {
                    next(err);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.drinks);
                    res.format({
                        "application/hal+json": function () {
                            res.json(resourceUtils.createCollectionResource(baseUrl, docs, "c", "ud"));
                        },
                        "application/json": function () {
                            res.json(docs);
                        }
                    });
                }
            });
        })
        .post(function (req, res, next) {
            commandService.send("createDrink").for("drink").with({payload: req.body}).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(202).end();
                });
            });
        });

    router.route("/:id")
        .get(function (req, res, next) {
            drinksCollection.findViewModels({id: req.params.id}, {limit: 1}, function (err, docs) {
                if (err) {
                    next(err);
                }
                else if (_.isEmpty(docs)) {
                    next(new HTTPErrors.NotFoundError("Drink with id '%s' not found", req.params.id));
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.drinks);
                    res.format({
                        "application/hal+json": function () {
                            res.json(resourceUtils.createResource(baseUrl, docs, "ud"));
                        },
                        "application/json": function () {
                            res.json(docs);
                        }
                    });
                }
            });
        })
        .put(function (req, res, next) {
            commandService.send("changeDrink").for("drink").instance(req.params.id).with({payload: req.body}).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.drinks);
                    res.format({
                        "application/hal+json": function () {
                            res.json(resourceUtils.createResource(baseUrl, evt.payload, "ud"));
                        },
                        "application/json": function () {
                            res.json(evt.payload);
                        }
                    });
                });
            });
        })
        .delete(function (req, res, next) {
            commandService.send("deleteDrink").for("drink").instance(req.params.id).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(204).end();
                });
            });
        });
}

module.exports = init;