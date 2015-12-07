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

var authenticate = require("../../services/auth.service").authenticate;

var dashboardCollection = require("../../cqrs/viewmodels/dashboard/collection");

module.exports = function (app) {
    logger.trace("initializing dashboard routes...");

    app.use(config.urls.dashboard, router);

    router.route("/")
        .get(function (req, res, next) {
            authenticate(req, function (err, isAdmin, isRoot, user) {
                // only return a resource if we are a customer. admins and roots do NOT have a basket.
                if (!isAdmin && !isRoot && user) {
                    dashboardCollection.findViewModels({}, function (err, docs) {
                        if (err) {
                            next(err);
                        }
                        var baseUrl = resourceUtils.createBaseUrl(req, config.urls.dashboard);
                        res.form(function () {
                            var resource = resourceUtils.createCollectionResource(baseUrl, docs, "", "");
                            _.forEach(resource._embedded.items, function (item) {
                                item.link("addToBasket", resourceUtils.createBaseUrl(req, config.urls.baskets + "/" + user.id));
                            });
                            return resource._embedded.items;

                        }, docs);
                    });
                } else {
                    dashboardCollection.findViewModels({}, function (err, docs) {
                        if (err) {
                            next(err);
                        }
                        else {
                            res.json(_.invoke(docs, "toJSON"));
                        }
                    });
                }
            });
        });
};