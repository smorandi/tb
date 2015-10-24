/**
 * Created by Stefano on 23.08.2015.
 */
"use strict";

var hal = require("halberd");
var config = require("../../config");
var logger = require("../../utils/logger");
var authService = require("../../services/auth.service");
var resourceUtils = require("../../utils/resourceUtils");

var HomeController = (function () {
    function HomeController() {
    }

    HomeController.prototype.createResource = function (req, callback) {
        var root = resourceUtils.createBaseUrl(req, "");
        var resource = new hal.Resource({}, root + config.urls.home);
        resource.link("dashboard", root + config.urls.dashboard);
        resource.link("root", root + config.urls.root);
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
            else {
                resource.link("registerCustomer", root + config.urls.customers);
            }
            callback(null, resource);
        });
    };

    HomeController.prototype.getAsResource = function (req, res, next) {
        var _this = this;

        _this.createResource(req, function (err, resource) {
            if (err) {
                next(err);
            }
            else {
                res.form(resource, null);
            }
        });
    };

    return HomeController;
})();

module.exports = HomeController;