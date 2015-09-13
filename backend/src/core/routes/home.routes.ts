/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import _ = require("lodash");
import logger = require("../../config/logger");
import config = require("../../config/config");
import resourceUtils = require("../utils/resourceUtils");
var hal = require("halberd");

function createDrinkResource(req:express.Request, drinkEntity:any):any {
    var resource = resourceUtils.createResource(req, config.urls.drinks, drinkEntity);
    return resource;
}

function init(app, viewModelOptions, repository, eventBus, domain, cmdSrv) {
    logger.trace("initializing home routes...")

    logger.trace("initializing customer routes...");

    var drinksRepo = repository.extend({
        collectionName: "drinks"
    });

    if (viewModelOptions.repository.type === "inmemory") {
        drinksRepo = require("../../viewmodels/drinks/collection").repository;
    }

    app.route('/home')
        .get((req, res, next) => {
            var baseUrl:string = req.protocol + "://" + req.headers["host"];
            var homeUrl:string = baseUrl + config.urls.home;
            var customersUrl:string = baseUrl + config.urls.customers;
            var drinksUrl:string = baseUrl + config.urls.drinks;
            var engineUrl:string = baseUrl + config.urls.engine;
            var dashboardUrl:string = baseUrl + "/dashboard";

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
                "application/hal+json": () =>  res.json(homeResource),
                "application/json": () =>  res.json(homeResource)
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

export = init;
