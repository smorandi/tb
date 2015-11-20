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
var requireLogin = require("../../services/auth.service.js").requireLogin;
var requireAdmin = require("../../services/auth.service.js").requireAdmin;
var requireMatchingUserId = require("../../services/auth.service.js").requireMatchingUserId;
var checkIsLogedIn = require("../middlewares/auth.middleware").isLogedIn;

var dashboardCollection = require("../../cqrs/viewmodels/dashboard/collection");

module.exports = function (app) {
    logger.trace("initializing dashboard routes...");

    app.use(config.urls.dashboard, router);

    router.route("/")
        .get(function (req, res, next) {
            checkIsLogedIn(req, res, function(isLoggedIn){
                if(isLoggedIn) {
                    dashboardCollection.findViewModels({}, function (err, docs) {
                        if(err){
                            next(err);
                        }
                        var baseUrl = resourceUtils.createBaseUrl(req, config.urls.dashboard);
                        res.form(function () {
                            var resource = resourceUtils.createCollectionResource(baseUrl, docs, "", "");
                            _.forEach(resource._embedded.items, function (item) {
                                item.link("addBasket", resourceUtils.createBaseUrl(req, config.urls.baskets + "/" + req.user.id));
                            });
                            return resource._embedded.items;

                        }, docs);
                    });
                } else {
                    dashboardCollection.findViewModels({}, function (err, docs) {
                        err ? next(err) : res.json(_.invoke(docs, "toJSON"));
                    });
                }
            });

        });
};