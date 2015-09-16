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

var hal = require("halberd");
var denormalizerService = require("../../cqrs/denormalizerService");

class AdminController {
    private createResource(req:express.Request):any {
        var self:string = req.protocol + "://" + req.headers["host"] + config.urls.admin;

        var resource = new hal.Resource(engine.engine, self);
        resource.link("replay", self + "/replays");
        resource.link("activate", self + "/activations");
        resource.link("deactivate", self + "/deactivations");

        return resource;
    }

    private asResource(req:express.Request, asHal:boolean):any {
        return asHal ? this.createResource(req) : engine.engine;
    }

    private handleResponse(req:express.Request, res:express.Response) {
        res.format({
            "application/hal+json": () =>  res.json(this.asResource(req, true)),
            "application/json": () =>  res.json(this.asResource(req, false))
        });
    }

    public getAsResource(req:express.Request, res:express.Response, next:Function):void {
        this.handleResponse(req, res);
    }

    public activateEngine(req:express.Request, res:express.Response, next:Function):void {
        logger.info("activating engine...");
        engine.activate();

        this.handleResponse(req, res);
    }

    public deactivateEngine(req:express.Request, res:express.Response, next:Function):void {
        logger.info("deactivating engine...");
        engine.deactivate();

        this.handleResponse(req, res);
    }


    public replay(req:express.Request, res:express.Response, next:Function):void {
        logger.info("replaying events...");
        denormalizerService.replay(err => {
            if (err) return next(err);

            engine.initDashboard();
            res.status(202).end();
        });
    }
}

export = AdminController;