/**
 * Created by Stefano on 25.07.2015.
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
var authService = require("../../services/auth.service");

var requireLogin = require("../middlewares/auth.middleware").requireLogin;
var requireAdmin = require("../middlewares/auth.middleware").requireAdmin;
var requireMatchingUserId = require("../middlewares/auth.middleware").requireMatchingUserId;

var homesCollection = require("../../cqrs/viewmodels/homes/collection");

module.exports = function (app) {
    logger.trace("initializing home routes...");

    app.use(config.urls.home, router);
    router.use(requireLogin);

    router.route("/")
        .get(function (req, res, next) {
            authService.authenticate(req, function (err, isAdmin, isRoot, user) {
                if (err) {
                    next(err);
                }
                else {
                    homesCollection.findViewModels({id: user.id}, {limit: 1}, function (err, docs) {
                        if (err) {
                            next(err);
                        }
                        else if (_.isEmpty(docs)) {
                            next(new HTTPErrors.NotFoundError("user with id '%s' not found", user.id));
                        }
                        else {
                            var root = resourceUtils.createBaseUrl(req, "");
                            var resource = new hal.Resource(docs[0].toJSON(), root + config.urls.home);
                            resource.link("dashboard", root + config.urls.dashboard);
                            resource.link("root", root + config.urls.root);

                            if (isAdmin || isRoot) {
                                resource.link("drinks", root + config.urls.drinks);
                                resource.link("system", root + config.urls.system);
                                resource.link("admins", root + config.urls.admins);
                                resource.link("customers", root + config.urls.customers);
                                resource.link("customerBaskets", root + config.urls.baskets);
                                resource.link("customerOrders", root + config.urls.orders);
                                if(isRoot) {
                                    resource.link("users", root + config.urls.users);
                                    resource.link("profile", root + config.urls.users + "/" + user.id);
                                }
                                if(isAdmin) {
                                    resource.link("profile", root + config.urls.admins + "/" + user.id);
                                }
                            }
                            else {
                                resource.link("profile", root + config.urls.customers + "/" + user.id);
                                resource.link("basket", root + config.urls.baskets + "/" + user.id);
                                resource.link("orders", root + config.urls.orders + "/" + user.id);
                            }

                            res.form(resource, null);
                        }
                    });
                }
            });
        });
};