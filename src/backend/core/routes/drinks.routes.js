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

var drinksCollection = require("../../cqrs/viewmodels/drinks/collection");

module.exports = function (app) {
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
                    res.form(resourceUtils.createCollectionResource(baseUrl, docs, "c", "ud"), docs);
                }
            });
        })
        .post(function (req, res, next) {
            commandService.send("createDrink").for("drink").with({payload: req.body}).go(res.handleEvent(function (evt) {
                res.status(202).end();
            }));
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
                    res.form(resourceUtils.createResource(baseUrl, docs[0], "ud"), docs[0]);
                }
            });
        })
        .put(function (req, res, next) {
            commandService.send("changeDrink").for("drink").instance(req.params.id).with({payload: req.body}).go(res.handleEvent(function (evt) {
                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.drinks);
                res.form(resourceUtils.createResource(baseUrl, evt.payload, "ud"), evt.payload);
            }));
        })
        .delete(function (req, res, next) {
            commandService.send("deleteDrink").for("drink").instance(req.params.id).go(res.handleEvent(function (evt) {
                res.status(204).end();
            }));
        });
};