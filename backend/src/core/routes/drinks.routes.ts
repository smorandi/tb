/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import logger = require("../../config/logger");
import config = require("../../config/config");
import resourceUtils = require("../utils/resourceUtils");

var commandService = require("../../cqrs/command.service");
var drinksCollection = require("../../cqrs/viewmodels/drinks/collection");

function init(app) {
    logger.trace("initializing drink routes...");

    app.route(config.urls.drinks)
        .get((req, res, next) => {

            var baseUrl = resourceUtils.createBaseUrl(req, config.urls.drinks);

            drinksCollection.findViewModels({}, (err, docs) => {
                if (err) return next(err);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createCollectionResource(baseUrl, docs, "c", "ud")),
                    "application/json": () =>  res.json(docs)
                });
            });
        }).post((req, res, next) => {
            commandService.send("createDrink").for("drink").with({payload: req.body}).go(evt => {
                if (evt.name === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(202).end();
                }
            });
        });


    app.route(config.urls.drinks + "/:id")
        .get((req, res, next) => {
            drinksCollection.loadViewModel(req.params.id, (err, doc) => {
                if (err) return next(err);
                if (!doc || doc.length === 0) return res.status(404).end();

                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.drinks);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createResource(baseUrl, doc, "ud")),
                    "application/json": () =>  res.json(doc)
                });
            });
        }).put((req, res, next) => {
            commandService.send("changeDrink").for("drink").instance(req.params.id).with({payload: req.body}).go(evt => {
                if (evt.event === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.drinks);

                    res.format({
                        "application/hal+json": () => res.json(resourceUtils.createResource(baseUrl, evt.payload, "ud")),
                        "application/json": () => res.json(evt.payload),
                    });
                }
            });
        }).delete((req, res, next) => {
            commandService.send("deleteDrink").for("drink").instance(req.params.id).go(evt => {
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