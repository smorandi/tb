/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />

"use strict";

import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');

import log4js = require('log4js');
import logger = require('./logger');

import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');

import utils = require("./utils");
import config = require("./config");

var app = express();

// view engine setup
app.set('views', path.join(config.serverRoot, '/core/views'));
app.set('view engine', 'hbs');

// Showing stack errors
app.set('showStackError', true);

app.use(favicon(path.join(config.serverRoot, '/public/favicon.ico')));

// Enable logger (log4js)
app.use(log4js.connectLogger(logger, {level: 'auto', format: ':method :url :status'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(config.serverRoot, '/public')));

// Globbing routing files
var routesFiles = utils.getGlobbedFiles("./core/routes/**/*.js");
logger.debug("initializing routes", routesFiles);
routesFiles.forEach(routePath => require(path.resolve(routePath))(app));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err["status"] = 404;
    next(err);
});

// error handlers
// generic shitty error handler. but will do for now...
app.use((err:any, req, res, next) => {
    res.status(err.status || 500);
    var message = err.message || err;
    var stack = err.stack || new Error()["stack"];
    res.format({
        'text/plain': function () {
            res.send(message + "\n" + stack);
        },
    });
    logger.error(message, err);
});

export = app;