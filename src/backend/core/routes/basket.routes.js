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
var requireCustomer = require("../middlewares/auth.middleware").requireCustomer;
var requireMatchingUserId = require("../middlewares/auth.middleware").requireMatchingUserId;

var basketsCollection = require("../../cqrs/viewmodels/baskets/collection");

module.exports = function (app) {
    logger.trace("initializing basket routes...");
    app.use(config.urls.baskets, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin);
    router.param("customerId", requireMatchingUserId);

    router.route("/")
        .get(requireAdmin, function (req, res, next) {
            var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets);
            basketsCollection.findViewModels({}, function (err, docs) {
                err ?
                    next(err) :
                    res.form(resourceUtils.createCollectionResource(baseUrl, docs), docs);
            });
        });

    router.route("/:customerId")
        .get(function (req, res, next) {
            basketsCollection.findViewModels({id: req.params.customerId}, {limit: 1}, function (err, docs) {
                if (err) {
                    next(err);
                }
                else if (_.isEmpty(docs)) {
                    next(new HTTPErrors.NotFoundError("Basket for customer '%s' not found", req.user.loginname));
                }
                else {
                    var basketItems = docs[0].get("basket");
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets + "/" + req.params.customerId);
                    res.form(function () {
                        var resource = resourceUtils.createCollectionResource(baseUrl, basketItems, "c", "d");
                        resource.link("createOrder", resourceUtils.createBaseUrl(req, config.urls.orders + "/" + req.params.customerId));
                        return resource;
                    }, basketItems);
                }
            });
        })
        .post(requireCustomer, function (req, res, next) {
            commandService.send("addBasketItem").for("user").instance(req.params.customerId).with({payload: req.body}).go(res.handleEvent(function (evt) {
                res.status(202).end();
            }));
        });

    router.route("/:customerId/:basketItemId")
        .get(function (req, res, next) {
            basketsCollection.findViewModels({id: req.params.customerId}, {limit: 1}, function (err, docs) {
                if (err) {
                    next(err);
                }
                else if (_.isEmpty(docs)) {
                    next(new HTTPErrors.NotFoundError("Basket for customer '%s' not found", req.user.loginname));
                }
                else {
                    var basketItems = docs[0].get("basket");
                    var basketItem = _.find(basketItems, "item.id", req.params.basketItemId);
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets + "/" + req.params.customerId + "/" + req.params.basketItemId);
                    res.form(resourceUtils.createResource(baseUrl, basketItem, "d"), basketItem);
                }
            });
        })
        .delete(function (req, res, next) {
            commandService.send("removeBasketItem").for("user").instance(req.params.customerId).with({payload: req.params.basketItemId}).go(res.handleEvent(function (evt) {
                res.status(204).end();
            }));
        });
}