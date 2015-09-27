/**
 * Created by Stefano on 23.08.2015.
 */
"use strict";

var hal = require("halberd");
var config = require("../../config");
var logger = require("../../utils/logger");
var authService = require("../../services/auth.service");

var HomeController = (function () {
    function HomeController() {
    }

    HomeController.prototype.createResource = function (req, callback) {
        var root = req.protocol + "://" + req.headers.host;
        var resource = new hal.Resource({}, root + config.urls.home);
        //resource.link("drinks", root + config.urls.drinks);
        //resource.link("customers", root + config.urls.customers);
        resource.link("dashboard", root + config.urls.dashboard);
        resource.link("registerCustomer", root + config.urls.customers);
        authService.authenticate(req, function (err, isAuthenticated, isAdmin, isRoot, user) {
            if (err) {
                callback(err);
                return;
            }
            if (isAuthenticated) {
                if (isAdmin || isRoot) {
                    resource.link("drinks", root + config.urls.drinks);
                    resource.link("profile", root + config.urls.admins + "/" + user.id);
                    resource.link("system", root + config.urls.system);
                    resource.link("admins", root + config.urls.admins);
                    resource.link("customers", root + config.urls.customers);
                    resource.link("customerBaskets", root + config.urls.baskets);
                    resource.link("customerOrders", root + config.urls.orders);
                }
                else {
                    resource.link("profile", root + config.urls.customers + "/" + user.id);
                    resource.link("basket", root + config.urls.baskets + "/" + user.id);
                    resource.link("orders", root + config.urls.orders + "/" + user.id);
                }
            }
            callback(null, resource);
        });
    };

    HomeController.prototype.asResource = function (req, asHal, callback) {
        return asHal ? this.createResource(req, callback) : callback(null, {});
    };

    HomeController.prototype.getAsResource = function (req, res, next) {
        var _this = this;
        res.format({
            "application/hal+json": function () {
                return _this.asResource(req, true, function (err, resource) {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.json(resource);
                    }
                });
            },
            "application/json": function () {
                return _this.asResource(req, false, function (err, resource) {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.json(resource);
                    }
                });
            }
        });
    };

    return HomeController;
})();

module.exports = HomeController;