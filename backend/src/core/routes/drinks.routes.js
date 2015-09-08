/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var logger = require("../../config/logger");
var config = require("../../config/config");
var resourceUtils = require("../utils/resourceUtils");
function init(app, options, repository, eventBus, domain, cmdSrv) {
    logger.trace("initializing drink routes...");
    var drinksRepo = repository.extend({
        collectionName: "drink"
    });
    if (options.repository.type === "inmemory") {
        drinksRepo = require("../../viewmodels/drinks/collection").repository;
    }
    app.route("/drinks")
        .get(function (req, res, next) {
        drinksRepo.find({}, function (err, docs) {
            if (err)
                return next(err);
            res.format({
                "application/hal+json": function () { return res.json(resourceUtils.createResources(req, config.urls.drinks, docs)); },
                "application/json": function () { return res.json(docs); }
            });
        });
    }).post(function (req, res, next) {
        cmdSrv.send("createDrink").for("drink").with({ payload: req.body }).go(function (evt) {
            res.status(201).end();
        });
    });
    app.route("/drinks/:id")
        .get(function (req, res, next) {
        drinksRepo.findOne({ id: req.params.id }, function (err, doc) {
            if (err)
                return next(err);
            if (!doc || doc.length === 0)
                return res.status(404).end();
            res.format({
                "application/hal+json": function () { return res.json(resourceUtils.createResource(req, config.urls.drinks, doc)); },
                "application/json": function () { return res.json(doc); }
            });
        });
    }).put(function (req, res, next) {
        cmdSrv.send("changeDrink").for("drink").instance(req.params.id).with({ payload: req.body }).go(function (evt) {
            if (evt.event === "commandRejected") {
                return next(evt.payload.reason);
            }
            else {
                res.format({
                    "application/hal+json": function () { return res.json(resourceUtils.createResource(req, config.urls.drinks, evt.payload)); },
                    "application/json": function () { return res.json(evt.payload); }
                });
            }
        });
    }).delete(function (req, res, next) {
        cmdSrv.send("deleteDrink").for("drink").instance(req.params.id).go(function (evt) {
            res.status(204).end();
        });
    });
}
module.exports = init;
//# sourceMappingURL=drinks.routes.js.map