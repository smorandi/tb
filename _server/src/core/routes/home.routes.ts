/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import logger = require("../../config/logger");
import config = require("../../config/config");
var hal = require("halberd");

function init(app) {
    logger.trace("initializing home routes...")

    app.route('/')
        .get((req, res, next) => {

            var baseUrl:string = req.protocol + "://" + req.headers["host"];
            var homeUrl:string = baseUrl + config.urls.home;
            var usersUrl:string = baseUrl + config.urls.users;
            var drinksUrl:string = baseUrl + config.urls.drinks;
            var engineUrl:string = baseUrl + config.urls.engine;

            var homeResource = new hal.Resource({}, homeUrl);

            var usersLink = new hal.Link("users", usersUrl);
            var drinksLink = new hal.Link("drinks", drinksUrl);
            var engineLink = new hal.Link("engine", engineUrl);

            homeResource.link(usersLink);
            homeResource.link(drinksLink);
            homeResource.link(engineLink);

            res.format({
                "application/hal+json": () => res.json(homeResource)
            });
        });
}

export = init;
