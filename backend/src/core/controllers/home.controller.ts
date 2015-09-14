/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import express = require("express");
import logger = require("../../config/logger");
import config = require("../../config/config");

import BaseController = require("./base.controller");

var hal = require("halberd");

class HomeController extends BaseController {
    constructor(repository:any, eventBus:any, domainService:any, cmdService:any) {
        super(repository, eventBus, domainService, cmdService);
    }

    private createResource(req:express.Request):any {
        var root:string = req.protocol + "://" + req.headers["host"];

        var resource = new hal.Resource({}, root + config.urls.home);
        resource.link("customers", root + config.urls.customers);
        resource.link("drinks", root + config.urls.drinks);
        resource.link("dashboard", root + config.urls.dashboard);
        resource.link("admin", root + config.urls.admin);

        return resource;
    }

    private asResource(req:express.Request, asHal:boolean):any {
        return asHal ? this.createResource(req) : {};
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
}

export = HomeController;