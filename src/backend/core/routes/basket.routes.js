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

var basketsCollection = require("../../cqrs/viewmodels/baskets/collection");

function init(app) {
    logger.trace("initializing basket routes...");
    app.use(config.urls.baskets, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin);
    router.param("customerId", requireMatchingUserId);

    router.route("/")
        .get(requireAdmin, function (req, res, next) {
            var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets);
            basketsCollection.findViewModels({}, function (err, docs) {
                if (err) {
                    return next(err);
                }
                else {
                    res.format({
                        "application/hal+json": function () {
                            return res.json(resourceUtils.createCollectionResource(baseUrl, docs));
                        },
                        "application/json": function () {
                            return res.json(docs);
                        }
                    });
                }
            });
        });

    router.route("/:customerId")
        .get(function (req, res, next) {
            basketsCollection.findViewModels({id: req.params.customerId}, function (err, docs) {
                if (err) {
                    return next(err);
                }
                else if (_.isEmpty(docs)) {
                    return res.status(404).end();
                }
                else {
                    var basketItems = docs[0].get("basket");
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets + "/" + req.params.customerId);
                    res.format({
                        "application/hal+json": function () {
                            var resource = resourceUtils.createCollectionResource(baseUrl, basketItems, "c", "d");
                            resource.link("createOrder", resourceUtils.createBaseUrl(req, config.urls.orders + "/" + req.params.customerId));
                            res.json(resource);
                        },
                        "application/json": function () {
                            return res.json(basketItems);
                        }
                    });
                }
            });
        })
        .post(function (req, res, next) {
            commandService.send("addBasketItem").for("user").instance(req.params.customerId).with({payload: req.body}).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(202).end();
                });
            });
        });

    router.route("/:customerId/:basketItemId")
        .get(function (req, res, next) {
            basketsCollection.findViewModels({id: req.params.customerId}, function (err, docs) {
                if (err) {
                    return next(err);
                }
                else if (_.isEmpty(docs)) {
                    return res.status(404).end();
                }
                else {
                    var basketItems = docs[0].get("basket");
                    var basketItem = _.find(basketItems, function (item) {
                        return item.id === req.params.basketItemId;
                    });
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets + "/" + req.params.customerId + "/" + req.params.basketItemId);
                    res.format({
                        "application/hal+json": function () {
                            return res.json(resourceUtils.createResource(baseUrl, basketItem, "d"));
                        },
                        "application/json": function () {
                            return res.json(basketItem);
                        }
                    });
                }
            });
        })
        .delete(function (req, res, next) {
            commandService.send("removeBasketItem").for("user").instance(req.params.customerId).with({payload: req.params.basketItemId}).go(function (evt) {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(204).end();
                });
            });
        });
}
module.exports = init;