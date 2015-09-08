/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var logger = require("../../config/logger");
var config = require("../../config/config");
var hal = require("halberd");
function init(app) {
    logger.trace("initializing home routes...");
    app.route('/')
        .get(function (req, res, next) {
        var baseUrl = req.protocol + "://" + req.headers["host"];
        var homeUrl = baseUrl + config.urls.home;
        var customersUrl = baseUrl + config.urls.customers;
        var drinksUrl = baseUrl + config.urls.drinks;
        var engineUrl = baseUrl + config.urls.engine;
        var homeResource = new hal.Resource({}, homeUrl);
        var customersLink = new hal.Link("customers", customersUrl);
        var drinksLink = new hal.Link("drinks", drinksUrl);
        var engineLink = new hal.Link("engine", engineUrl);
        homeResource.link(customersLink);
        homeResource.link(drinksLink);
        homeResource.link(engineLink);
        res.format({
            "application/hal+json": function () { return res.json(homeResource); }
        });
    });
}
module.exports = init;
//# sourceMappingURL=home.routes.js.map