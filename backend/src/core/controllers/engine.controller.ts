/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import engine = require("../../engine/engine");
import logger = require("../../config/logger");
import config = require("../../config/config");

var hal = require("halberd");

class EngineController  {
    constructor() {
    }

    public createResource(req:express.Request):any {
        var self = req.protocol + "://" + req.headers["host"] + config.urls.engine;

        var resource = new hal.Resource(engine.engine, self);

        resource.link("activate", self + "/activations");
        resource.link("deactivate", self + "/deactivations");

        return resource;
    }

    public getAsResource(req:express.Request, res:express.Response, next:Function):void {
        res.format({
            "application/hal+json": () =>  res.json(this.createResource(req)),
            "application/json": () =>  res.json(engine.engine)
        });
    }

    public activateEngine(req:express.Request, res:express.Response, next:Function):void {
        logger.info("activating engine...");
        engine.activate();

        res.format({
            "application/hal+json": () => res.json(this.createResource(req)),
            "application/json": () => res.json(engine.engine),
        });
    }

    public deactivateEngine(req:express.Request, res:express.Response, next:Function):void {
        logger.info("deactivating engine...");
        engine.deactivate();

        res.format({
            "application/hal+json": () => res.json(this.createResource(req)),
            "application/json": () => res.json(engine.engine),
        });
    }
}

var engineController = new EngineController();
export = engineController;