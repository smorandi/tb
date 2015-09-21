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

var customersCollection = require("../../cqrs/viewmodels/customers/collection");
var commandService = require("../../cqrs/command.service");

function init(app) {
    logger.trace("initializing customer routes...");

    app.route(config.urls.customers)
        .get((req, res, next) => {
            customersCollection.findViewModels({}, (err, docs) => {
                if (err) {
                    return next(err);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers);

                    res.format({
                        "application/hal+json": () =>  res.json(resourceUtils.createCollectionResource(baseUrl, docs, "c", "ud")),
                        "application/json": () =>  res.json(docs)
                    });
                }
            });
        }).post((req, res, next) => {
            commandService.send("createCustomer").for("user").with({payload: req.body}).go(evt => {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(202).end();
                });
            });
        });


    app.route(config.urls.customers + "/:id")
        .get((req, res, next) => {
            customersCollection.findViewModels({id: req.params.id}, (err, docs) => {
                if (err) {
                    return next(err);
                }
                else if (_.isEmpty(docs)) {
                    return res.status(404).end()
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers + "/" + req.params.id);

                    res.format({
                        "application/hal+json": () =>  res.json(resourceUtils.createResource(baseUrl, docs[0], "ud")),
                        "application/json": () =>  res.json(docs[0])
                    });
                }
            });
        }).put((req, res, next) => {
            commandService.send("changeUser").for("user").instance(req.params.id).with({payload: req.body}).go(evt => {
                commandService.handleCommandRejection(evt, next, function () {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.customers);
                    res.format({
                        "application/hal+json": () => res.json(resourceUtils.createResource(baseUrl, evt.payload, "ud")),
                        "application/json": () => res.json(evt.payload),
                    });
                });
            });
        }).delete((req, res, next) => {
            commandService.send("deleteUser").for("user").instance(req.params.id).go(evt => {
                commandService.handleCommandRejection(evt, next, function () {
                    res.status(204).end();
                });
            });
        });
}

export = init;