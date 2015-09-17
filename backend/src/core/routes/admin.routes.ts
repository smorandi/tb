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

var adminsCollection = require("../../cqrs/viewmodels/admins/collection");
var commandService = require("../../cqrs/command.service");

function init(app) {
    logger.trace("initializing admin routes...");

    app.route(config.urls.admins)
        .get((req, res, next) => {
            adminsCollection.findViewModels({}, (err, docs) => {
                if (err) return next(err);

                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.admins);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createCollectionResource(baseUrl, docs, "c", "ud")),
                    "application/json": () =>  res.json(docs)
                });
            });
        }).post((req, res, next) => {
            commandService.send("createAdmin").for("user").with({payload: req.body}).go(evt => {
                if (evt.name === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(202).end();
                }
            });
        });


    app.route(config.urls.admins + "/:id")
        .get((req, res, next) => {
            adminsCollection.loadViewModel(req.params.id, (err, doc) => {
                if (err) return next(err);
                if (!doc || doc.length === 0) return res.status(404).end();

                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.admins + "/" + req.params.id);

                res.format({
                    "application/hal+json": () =>  res.json(resourceUtils.createResource(baseUrl, doc, "ud")),
                    "application/json": () =>  res.json(doc)
                });
            });
        }).put((req, res, next) => {
            commandService.send("changeUser").for("user").instance(req.params.id).with({payload: req.body}).go(evt => {
                if (evt.name === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    var baseUrl = resourceUtils.createBaseUrl(req, config.urls.admins);
                    res.format({
                        "application/hal+json": () => res.json(resourceUtils.createResource(baseUrl, evt.payload, "ud")),
                        "application/json": () => res.json(evt.payload),
                    });
                }
            });
        }).delete((req, res, next) => {
            commandService.send("deleteUser").for("user").instance(req.params.id).go(evt => {
                if (evt.name === "commandRejected") {
                    return next(evt.payload.reason);
                }
                else {
                    res.status(204).end();
                }
            });
        });
}

export = init;