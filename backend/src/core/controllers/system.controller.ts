/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import engine = require("../engine/engine");
import logger = require("../../config/logger");
import config = require("../../config/config");
import BaseController = require("./base.controller");

var engineCollection = require("../../cqrs/viewmodels/engine/collection");

var hal = require("halberd");
var denormalizerService = require("../../cqrs/denormalizer.service");

class SystemController {
    private createResource(req:express.Request, callback:any):any {
        var self:string = req.protocol + "://" + req.headers["host"] + config.urls.system;

        engineCollection.loadViewModel("engine", function (err, doc) {
            var resource = new hal.Resource(doc.toJSON(), self);
            resource.link("replay", self + "/replays");
            resource.link("activate", self + "/activations");
            resource.link("deactivate", self + "/deactivations");
            callback(null, resource)
        });
    }

    private handleResponse(req:express.Request, res:express.Response, next:Function) {
        this.createResource(req, function (err, resource) {
            if (err) {
                next(err);
            }
            else {
                res.format({
                    "application/hal+json": () =>  res.json(resource),
                    "application/json": () =>  res.json(resource)
                });
            }
        });
    }

    public getAsResource(req:express.Request, res:express.Response, next:Function):void {
        this.handleResponse(req, res, next);
    }

    public activateEngine(req:express.Request, res:express.Response, next:Function):void {
        logger.info("activating engine...");
        engine.activate((err) => {
            this.handleResponse(req, res, next);
        });
    }

    public deactivateEngine(req:express.Request, res:express.Response, next:Function):void {
        logger.info("deactivating engine...");
        engine.deactivate((err) => {
            this.handleResponse(req, res, next);
        });
    }

    public replay(req:express.Request, res:express.Response, next:Function):void {
        logger.info("replaying events...");
        denormalizerService.replay(err => {
            if (err) return next(err);
            res.status(202).end();
        });
    }
}

export = SystemController;