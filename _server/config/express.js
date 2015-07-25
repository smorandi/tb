/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var logger = require('./logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('../routes/index.routes');
var drinks = require('../routes/drinks.routes');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'hbs');
// Enable logger (morgan)
app.use(morgan(logger.getLogFormat(), logger.getLogOptions()));
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/drinks', drinks);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err["status"] = 404;
    next(err);
});
// error handlers
// generic shitty error handler. but will do for now...
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    var message = err.message || err;
    var stack = err.stack || new Error()["stack"];
    res.format({
        'text/plain': function () {
            res.send(message + "\n" + stack);
        }
    });
});
module.exports = app;
//# sourceMappingURL=express.js.map