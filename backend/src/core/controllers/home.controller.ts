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
var authService = require("../authentication/auth.service");

class HomeController {
    private createResource(req:express.Request, callback):any {
        var root:string = req.protocol + "://" + req.headers["host"];

        var resource = new hal.Resource({}, root + config.urls.home);
        resource.link("drinks", root + config.urls.drinks);
        resource.link("customers", root + config.urls.customers);
        resource.link("dashboard", root + config.urls.dashboard);
        resource.link("registerCustomer", root + config.urls.customers);

        if (authService.authenticate(req, function (err, isAuthenticated, isAdmin, user) {
                if (err) {
                    callback(err);
                    return;
                }

                if(isAuthenticated) {
                    if (isAdmin) {
                        resource.link("profile", root + config.urls.admins + "/" + user.id);
                        resource.link("system", root + config.urls.system);
                        resource.link("admins", root + config.urls.admins);
                        resource.link("customerBaskets", root + config.urls.baskets);
                        resource.link("customerOrders", root + config.urls.orders);
                    }
                    else {
                        resource.link("profile", root + config.urls.customers + "/" + user.id);
                        resource.link("basket", root + config.urls.baskets + "/" + user.id);
                        resource.link("orders", root + config.urls.orders + "/" + user.id);
                    }
                }

                callback(null, resource);
            }));
    }

    private asResource(req:express.Request, asHal:boolean, callback):any {
        return asHal ? this.createResource(req, callback) : callback(null, {});
    }

    public getAsResource(req:express.Request, res:express.Response, next:Function):void {
        res.format({
            "application/hal+json": () =>  this.asResource(req, true, function (err, resource) {
                if (err) {
                    next(err);
                }
                else {
                    res.json(resource);
                }
            }),
            "application/json": () =>  this.asResource(req, false, function (err, resource) {
                if (err) {
                    next(err);
                }
                else {
                    res.json(resource);
                }
            })
        });
    }
}

export = HomeController;