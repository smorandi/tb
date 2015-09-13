/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var logger = require("../../config/logger");
var config = require("../../config/config");
var resourceUtils = require("../utils/resourceUtils");
var hal = require("halberd");
function createDrinkResource(req, drinkEntity) {
    var resource = resourceUtils.createResource(req, config.urls.drinks, drinkEntity);
    return resource;
}
function init(app, viewModelOptions, repository, eventBus, domain, cmdSrv) {
    logger.trace("initializing home routes...");
    logger.trace("initializing customer routes...");
    var drinksRepo = repository.extend({
        collectionName: "drinks"
    });
    if (viewModelOptions.repository.type === "inmemory") {
        drinksRepo = require("../../viewmodels/drinks/collection").repository;
    }
    app.route('/home')
        .get(function (req, res, next) {
        var baseUrl = req.protocol + "://" + req.headers["host"];
        var homeUrl = baseUrl + config.urls.home;
        var customersUrl = baseUrl + config.urls.customers;
        var drinksUrl = baseUrl + config.urls.drinks;
        var engineUrl = baseUrl + config.urls.engine;
        var dashboardUrl = baseUrl + "/dashboard";
        var homeResource = new hal.Resource({}, homeUrl);
        var customersLink = new hal.Link("customers", customersUrl);
        var drinksLink = new hal.Link("drinks", drinksUrl);
        var engineLink = new hal.Link("engine", engineUrl);
        var dashboardLink = new hal.Link("dashboard", dashboardUrl);
        homeResource.link(customersLink);
        homeResource.link(drinksLink);
        homeResource.link(engineLink);
        homeResource.link(dashboardLink);
        res.format({
            "application/hal+json": function () { return res.json(homeResource); },
            "application/json": function () { return res.json(homeResource); }
        });
        //drinksRepo.find({}, (err, docs) => {
        //    if (err) return next(err);
        //
        //    //var items = [];
        //    //docs.forEach((entity, index, entities) => items.push(entity.toJSON()));
        //    //homeResource.items = items;
        //
        //    //docs.forEach((entity, index, entities) => homeResource.embed("dashboard", resourceUtils.createResource(req, "/dashboard", entity.toJSON())));
        //
        //    res.format({
        //        "application/hal+json": () =>  res.json(homeResource),
        //        "application/json": () =>  res.json(homeResource)
        //    });
        //});
    });
}
module.exports = init;
//# sourceMappingURL=home.routes.js.map