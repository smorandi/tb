/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />

"use strict";

import express = require("express");
import path = require("path");
import favicon = require("serve-favicon");

import log4js = require("log4js");
import logger = require("./logger");

import cookieParser = require("cookie-parser");
import bodyParser = require("body-parser");

import utils = require("./utils");
import config = require("./config");

var helmet = require("helmet");
var cors = require("cors");


function init() {
    var app = express();

// view engine setup
    app.set("views", path.join(config.serverRoot, "/core/views"));
    app.set("view engine", "hbs");

// Showing stack errors
    app.set("showStackError", true);

    app.use(favicon(path.join(config.serverRoot, "/public/favicon.ico")));

// Enable logger (log4js)
    app.use(log4js.connectLogger(logger, {
        level: "auto",
        format: ":method :url :status :req[Accept] :res[Content-Type]"
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

// just for now...logging any json content of the request..
    app.use((req, res, next) => {
        logger.trace("request-body: \n", req.body);
        next();
    });

//use cors to allow everything (for now)
    app.use(cors());

// Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable("x-powered-by");

    app.use(cookieParser());

    app.use(express.static(path.join(config.serverRoot, "/public")));

// Globbing routing files
    var routesFiles = utils.getGlobbedFiles(path.join(config.serverRoot, "/src/core/routes/**/*.js"));
    logger.debug("initializing routes", routesFiles);
    routesFiles.forEach(routePath => require(path.resolve(routePath))(app));

// catch 404 and forward error handler
    app.use((req, res, next) => {
        var err:any = new Error("Not Found");
        err.status = 404;
        next(err);
    });

    // error handlers...
    // handling domain validation and businessrule errors (enriching and passing them to the next layer)
    app.use((err:any, req, res, next) => {
        if (err.name === "BusinessRuleError" ||
            err.name === "ValidationError") {
            err.status = 400;
        }
        next(err);
    });

    // end of line...analyse what error we got and return any infos to the client...
    app.use((err:any, req, res, next) => {
        var status = err.status || 500;
        // we are not using the status in the content itself, we put it into the response header...
        delete(err.status);
        logger.error("application error: ", err);
        res.status(status).json(err);
    });

    return app;
}
export = init;