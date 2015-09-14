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
var hal = require("halberd");

function init(app, viewModelOptions, repository, eventBus, domain, cmdSrv) {
    logger.trace("initializing customer routes...");

    var customerRepo = repository.extend({
        collectionName: "customers"
    });

    if (viewModelOptions.repository.type === "inmemory") {
        customerRepo = require("../../viewmodels/customers/collection").repository;
    }

    app.route("/customers")
        .get((req, res, next) => {
            customerRepo.find({}, (err, docs) => {
                if (err) return next(err);

                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createCollectionResource(baseUrl, docs, "c", "ud")),
                    "application/json": () =>  res.json(docs)
                });
            });
        }).post((req, res, next) => {
            cmdSrv.send("createCustomer").for("customer").with({payload: req.body}).go(evt => {
                if (evt.event === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(202).end();
                }
            });
        });


    app.route("/customers/:id")
        .get((req, res, next) => {
            customerRepo.findOne({id: req.params.id}, (err, doc) => {
                if (err) return next(err);
                if (!doc || doc.length === 0) return res.status(404).end();

                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers + "/" + req.params.id);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createResource(baseUrl, doc, "ud")),
                    "application/json": () =>  res.json(doc)
                });
            });
        }).put((req, res, next) => {
            cmdSrv.send("changeCustomer").for("customer").instance(req.params.id).with({payload: req.body}).go(evt => {
                if (evt.event === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers);
                    res.format({
                        "application/hal+json": () => res.json(resourceUtils.createResource(baseUrl, evt.payload, "ud")),
                        "application/json": () => res.json(evt.payload),
                    });
                }
            });
        }).delete((req, res, next) => {
            cmdSrv.send("deleteCustomer").for("customer").instance(req.params.id).go(evt => {
                if (evt.event === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(204).end();
                }
            });
        });

    //app.route("/customers/:id/basketItems")
    //    .get((req, res, next) => {
    //        customerRepo.findOne({id: req.params.id}, (err, doc) => {
    //            if (err) return next(err);
    //            if (!doc || doc.length === 0) return res.status(404).end();
    //
    //            var basketItems = doc.get("basketItems");
    //
    //            var baseUrl = "/customers/" + req.params.id + "/basketItems";
    //
    //            res.format({
    //                "application/hal+json": () =>  res.json(resourceUtils.createResources(req, baseUrl, basketItems)),
    //                "application/json": () =>  res.json(basketItems)
    //            });
    //        });
    //    }).post((req, res, next) => {
    //        cmdSrv.send("addBasketItem").for("customer").instance(req.params.id).with({payload: req.body}).go(evt => {
    //            if (evt.event === "commandRejected") {
    //                return next(evt.payload.reason);
    //            }
    //            else {
    //                res.status(201).end();
    //            }
    //        });
    //    });
    //
    //app.route("/customers/:customerId/basketItems/:basketItemId")
    //    .get((req, res, next) => {
    //        customerRepo.findOne({id: req.params.customerId}, (err, doc) => {
    //            if (err) return next(err);
    //            if (!doc || doc.length === 0) return res.status(404).end();
    //
    //            var basketItems = doc.get("basketItems");
    //
    //            var basketItem = _.find(basketItems, (item:any) => item.id === req.params.basketItemId);
    //
    //            var baseUrl = "/customers/" + req.params.customerId + "/basketItems/" + req.params.basketItemId;
    //
    //            res.format({
    //                "application/hal+json": () =>  res.json(resourceUtils.createResource(req, baseUrl, basketItem)),
    //                "application/json": () =>  res.json(basketItem)
    //            });
    //        });
    //    }).delete((req, res, next) => {
    //        cmdSrv.send("removeBasketItem").for("customer").instance(req.params.customerId).with({payload: req.params.basketItemId}).go(evt => {
    //            if (evt.event === "commandRejected") {
    //                return next(evt.payload.reason);
    //            }
    //            else {
    //                res.status(204).end();
    //            }
    //        });
    //    });
    //
    //app.route("/customers/:id/orders")
    //    .get((req, res, next) => {
    //        customerRepo.findOne({id: req.params.id}, (err, doc) => {
    //            if (err) return next(err);
    //            if (!doc || doc.length === 0) return res.status(404).end();
    //
    //            var orders = doc.get("orders");
    //
    //            var baseUrl = "/customers/" + req.params.id + "/orders";
    //
    //            res.format({
    //                "application/hal+json": () =>  res.json(resourceUtils.createResources(req, baseUrl, orders)),
    //                "application/json": () =>  res.json(orders)
    //            });
    //        });
    //    }).post((req, res, next) => {
    //        cmdSrv.send("makeOrder").for("customer").instance(req.params.id).go(evt => {
    //            if (evt.event === "commandRejected") {
    //                return next(evt.payload.reason);
    //            }
    //            else {
    //                res.status(201).end();
    //            }
    //        });
    //    });
}

export = init;