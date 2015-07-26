/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />

"use strict";

//import express = require('express');
//
//var router = express.Router();
//
///* GET home page. */
//router.get('/', (req, res, next) => res.render('index', {title: 'Express'}));
//
//export = router;

function init(app) {
    app.route('/')
        .get((req, res, next) => res.render('index', {title: 'Express'}));
}

export = init;
