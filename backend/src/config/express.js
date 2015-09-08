/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var log4js = require("log4js");
var logger = require("./logger");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var utils = require("./utils");
var config = require("./config");
var helmet = require("helmet");
var cors = require("cors");
function init(options, repository, emitter, domain, evtCmd) {
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
    app.use(bodyParser.urlencoded({ extended: false }));
    // just for now...logging any json content of the request..
    app.use(function (req, res, next) {
        logger.trace("\n", req.body);
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
    routesFiles.forEach(function (routePath) { return require(path.resolve(routePath))(app, options, repository, emitter, domain, evtCmd); });
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error("Not Found");
        err["status"] = 404;
        next(err);
    });
    // error handlers
    // generic shitty error handler. but will do for now...
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        var message = err.message || err;
        var stack = err.stack || new Error()["stack"];
        res.json(err);
        logger.error(message, err);
    });
    return app;
}
module.exports = init;
//# sourceMappingURL=express.js.map