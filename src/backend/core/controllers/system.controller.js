/**
 * Created by Stefano on 23.08.2015.
 */
"use strict";

var hal = require("halberd");
var async = require("async");
var _ = require("lodash");
var logger = require("../../utils/logger");
var config = require("../../config");
var engineCollection = require("../../cqrs/viewmodels/engine/collection");
var systemService = require("../../services/system.service.js");
var HTTPErrors = require("http-custom-errors");

var SystemController = (function () {
    function SystemController() {
    }

    SystemController.prototype.createResource = function (req, callback) {
        var self = req.protocol + "://" + req.headers.host + config.urls.system;
        engineCollection.findViewModels({id: "engine"}, {limit: 1}, function (err, docs) {
            if (err) {
                callback(err);
            }
            else if(_.isEmpty(docs)) {
                callback(new HTTPErrors.NotFoundError("Engine not found"));
            }
            else {
                var resource = new hal.Resource(docs[0].toJSON(), self);
                resource.link("changePriceReductionInterval", self);
                resource.link("replay", self + "/replays");
                resource.link("startEngine", self + "/engineStarts");
                resource.link("stopEngine", self + "/engineStops");
                resource.link("reInitialize", self + "/reinitializations");
                callback(null, resource);
            }
        });
    };

    SystemController.prototype.handleResponse = function (req, res, next) {
        this.createResource(req, function (err, resource) {
            if (err) {
                next(err);
            }
            else {
                res.format({
                    "application/hal+json": function () {
                        return res.json(resource);
                    },
                    "application/json": function () {
                        return res.json(resource);
                    }
                });
            }
        });
    };

    SystemController.prototype.getAsResource = function (req, res, next) {
        this.handleResponse(req, res, next);
    };

    SystemController.prototype.changePriceReductionInterval = function (req, res, next) {
        var _this = this;
        logger.info("updating engine...");
        systemService.changePriceReductionInterval(req.body.priceReductionInterval, function (err) {
            _this.handleResponse(req, res, next);
        });
    };

    SystemController.prototype.startEngine = function (req, res, next) {
        var _this = this;
        logger.info("starting engine...");
        systemService.startEngine(function (err) {
            logger.info("engine started");
            _this.handleResponse(req, res, next);
        });
    };

    SystemController.prototype.stopEngine = function (req, res, next) {
        var _this = this;
        logger.info("stopping engine...");
        systemService.stopEngine(function (err) {
            logger.info("engine stopped");
            _this.handleResponse(req, res, next);
        });
    };

    SystemController.prototype.replay = function (req, res, next) {
        logger.info("replaying events...");
        systemService.replay(function (err) {
            if (err) {
                return next(err);
            }
            else {
                logger.info("events replayed");
                res.status(202).end();
            }
        });
    };

    SystemController.prototype.reInitialize = function (req, res, next) {
        logger.info("reinitializing...");

        systemService.reInit(function (err) {
            if (err) {
                next(err);
            }
            else {
                logger.info("reinitialized");
                res.status(202).end();
            }
        });
    };

    return SystemController;
})();

module.exports = SystemController;