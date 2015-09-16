/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var logger = require("../../config/logger");
var config = require("../../config/config");
var resourceUtils = require("../utils/resourceUtils");
var viewmodelService = require("../../cqrs/viewmodelService");
var commandService = require("../../cqrs/commandService");
function getRepository() {
    return viewmodelService.getRepository("drinks");
}
function init(app) {
    logger.trace("initializing drink routes...");
    app.route("/drinks")
        .get(function (req, res, next) {
        var baseUrl = resourceUtils.createBaseUrl(req, config.urls.drinks);
        getRepository().find({}, function (err, docs) {
            if (err)
                return next(err);
            res.format({
                "application/hal+json": function () { return res.json(resourceUtils.createCollectionResource(baseUrl, docs, "c", "ud")); },
                "application/json": function () { return res.json(docs); }
            });
        });
    }).post(function (req, res, next) {
        commandService.send("createDrink").for("drink").with({ payload: req.body }).go(function (evt) {
            if (evt.event === "commandRejected") {
                return next(evt.payload.reason);
            }
            else {
                res.status(202).end();
            }
        });
    });
    app.route("/drinks/:id")
        .get(function (req, res, next) {
        getRepository().findOne({ id: req.params.id }, function (err, doc) {
            if (err)
                return next(err);
            if (!doc || doc.length === 0)
                return res.status(404).end();
            var baseUrl = resourceUtils.createBaseUrl(req, config.urls.drinks);
            res.format({
                "application/hal+json": function () { return res.json(resourceUtils.createResource(baseUrl, doc, "ud")); },
                "application/json": function () { return res.json(doc); }
            });
        });
    }).put(function (req, res, next) {
        commandService.send("changeDrink").for("drink").instance(req.params.id).with({ payload: req.body }).go(function (evt) {
            if (evt.event === "commandRejected") {
                return next(evt.payload.reason);
            }
            else {
                var baseUrl = resourceUtils.createBaseUrl(req, config.urls.baskets);
                res.format({
                    "application/hal+json": function () { return res.json(resourceUtils.createResource(baseUrl, evt.payload, "ud")); },
                    "application/json": function () { return res.json(evt.payload); }
                });
            }
        });
    }).delete(function (req, res, next) {
        commandService.send("deleteDrink").for("drink").instance(req.params.id).go(function (evt) {
            if (evt.event === "commandRejected") {
                return next(evt.payload.reason);
            }
            else {
                res.status(204).end();
            }
        });
    });
}
module.exports = init;
//# sourceMappingURL=drinks.routes.js.map