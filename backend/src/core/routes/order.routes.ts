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

function init(app, options, repository, eventBus, domain, cmdSrv) {
    logger.trace("initializing basket routes...");

    var ordersRepo = repository.extend({
        collectionName: "orders"
    });

    if (options.repository.type === "inmemory") {
        ordersRepo = require("../../viewmodels/orders/collection").repository;
    }

    app.route("/orders")
        .get((req, res, next) => {
            ordersRepo.find({}, (err, docs) => {
                if (err) return next(err);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createResources(req, config.urls.orders, docs)),
                    "application/json": () =>  res.json(docs)
                });
            });
        });

    app.route("/orders/:id")
        .get((req, res, next) => {
            ordersRepo.findOne({id: req.params.id}, (err, doc) => {
                if (err) return next(err);
                if (!doc || doc.length === 0) return res.status(404).end();

                var orders = doc.get("orders");

                var baseUrl = "/orders/" + req.params.id;

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createResources(req, baseUrl, orders)),
                    "application/json": () =>  res.json(orders)
                });
            });
        }).post((req, res, next) => {
            cmdSrv.send("makeOrder").for("customer").instance(req.params.id).go(evt => {
                if (evt.event === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(201).end();
                }
            });
        });
}

export = init;