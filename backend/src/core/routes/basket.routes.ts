/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import _ = require("lodash");
import url = require("url");
import logger = require("../../config/logger");
import config = require("../../config/config");
import resourceUtils = require("../utils/resourceUtils");
var hal = require("halberd");

function init(app, options, repository, eventBus, domain, cmdSrv) {
    logger.trace("initializing basket routes...");

    var basketsRepo = repository.extend({
        collectionName: "baskets"
    });

    if (options.repository.type === "inmemory") {
        basketsRepo = require("../../viewmodels/baskets/collection").repository;
    }

    app.route("/baskets")
        .get((req, res, next) => {
            var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets);

            basketsRepo.find({}, (err, docs) => {
                if (err) return next(err);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createCollectionResource(baseUrl, docs)),
                    "application/json": () =>  res.json(docs)
                });
            });
        });


    app.route("/baskets/:customerId")
        .get((req, res, next) => {
            basketsRepo.findOne({id: req.params.customerId}, (err, doc) => {
                if (err) return next(err);
                if (!doc || doc.length === 0) return res.status(404).end();

                var basketItems = doc.get("basket");
                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets + "/" + req.params.customerId);

                res.format({
                    "application/hal+json": () => {
                        var resource = resourceUtils.createCollectionResource(baseUrl, basketItems, "c", "d");
                        resource.link("makeOrder", resourceUtils.createBaseUrl(req, config.urls.orders + "/" + req.params.customerId));
                        res.json(resource);
                    },
                    "application/json": () =>  res.json(basketItems)
                });
            });
        }).post((req, res, next) => {
            cmdSrv.send("addBasketItem").for("customer").instance(req.params.customerId).with({payload: req.body}).go(evt => {
                if (evt.event === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(202).end();
                }
            });
        });

    app.route("/baskets/:customerId/:basketItemId")
        .get((req, res, next) => {
            basketsRepo.findOne({id: req.params.customerId}, (err, doc) => {
                if (err) return next(err);
                if (!doc || doc.length === 0) return res.status(404).end();

                var basketItems = doc.get("basket");
                var basketItem = _.find(basketItems, (item:any) => item.id === req.params.basketItemId);

                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets + "/" + req.params.customerId + "/" + req.params.basketItemId);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createResource(baseUrl, basketItem, "d")),
                    "application/json": () =>  res.json(basketItem)
                });
            });
        }).delete((req, res, next) => {
            cmdSrv.send("removeBasketItem").for("customer").instance(req.params.customerId).with({payload: req.params.basketItemId}).go(evt => {
                if (evt.event === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(204).end();
                }
            });
        });
}

export = init;