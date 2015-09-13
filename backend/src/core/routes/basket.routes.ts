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

    var basketsRepo = repository.extend({
        collectionName: "baskets"
    });

    if (options.repository.type === "inmemory") {
        basketsRepo = require("../../viewmodels/baskets/collection").repository;
    }

    app.route("/baskets")
        .get((req, res, next) => {
            basketsRepo.find({}, (err, docs) => {
                if (err) return next(err);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createResources(req, config.urls.baskets, docs)),
                    "application/json": () =>  res.json(docs)
                });
            });
        });


    app.route("/baskets/:id")
        .get((req, res, next) => {
            basketsRepo.findOne({id: req.params.id}, (err, doc) => {
                if (err) return next(err);
                if (!doc || doc.length === 0) return res.status(404).end();

                var basketItems = doc.get("basketItems");

                var baseUrl = "/baskets/" + req.params.id;

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createResources(req, baseUrl, basketItems)),
                    "application/json": () =>  res.json(basketItems)
                });
            });
        }).post((req, res, next) => {
            cmdSrv.send("addBasketItem").for("customer").instance(req.params.id).with({payload: req.body}).go(evt => {
                if (evt.event === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(201).end();
                }
            });
        });

    app.route("/baskets/:customerId/:basketItemId")
        .get((req, res, next) => {
            basketsRepo.findOne({id: req.params.customerId}, (err, doc) => {
                if (err) return next(err);
                if (!doc || doc.length === 0) return res.status(404).end();

                var basketItems = doc.get("basketItems");
                var basketItem = _.find(basketItems, (item:any) => item.id === req.params.basketItemId);

                var baseUrl = "/baskets/" + req.params.customerId + "/" + req.params.basketItemId;

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createResource(req, baseUrl, basketItem)),
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