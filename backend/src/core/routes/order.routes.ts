/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import _ = require("lodash");
import logger = require("../../config/logger");
import config = require("../../config/config");
import resourceUtils = require("../utils/resourceUtils");

var ordersCollection = require("../../cqrs/viewmodels/orders/collection");
var commandService = require("../../cqrs/command.service");

function init(app) {
    logger.trace("initializing basket routes...");

    app.route(config.urls.orders)
        .get((req, res, next) => {
            ordersCollection.findViewModels({}, (err, docs) => {
                if (err) return next(err);

                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.orders);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createCollectionResource(baseUrl, docs)),
                    "application/json": () =>  res.json(docs)
                });
            });
        });

    app.route(config.urls.orders + "/:customerId")
        .get((req, res, next) => {
            ordersCollection.loadViewModel(req.params.id, (err, doc) => {
                if (err) return next(err);
                if (!doc || doc.length === 0) return res.status(404).end();

                var orders = doc.get("orders");
                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.orders + "/" + req.params.customerId);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createCollectionResource(baseUrl, orders)),
                    "application/json": () =>  res.json(orders)
                });
            });
        }).post((req, res, next) => {
            commandService.send("makeOrder").for("customer").instance(req.params.customerId).go(evt => {
                if (evt.name === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(202).end();
                }
            });
        });
}

export = init;