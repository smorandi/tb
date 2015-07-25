/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />

import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');

import log4js = require('log4js');
import logger = require('./logger');

import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');

import routes = require('../routes/index.routes');
import drinks = require('../routes/drinks.routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'hbs');

// Enable logger (log4js)
app.use(favicon(__dirname + '/../public/favicon.ico'));

app.use(log4js.connectLogger(logger, { level: 'auto', format: ':method :url :status' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/drinks', drinks);

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
});

export = app;