/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />

"use strict";

import express = require('express');
import drinksController = require("../controllers/drinks.controller");


//var router = express.Router();
//
//router.get("/", drinksController.getAll);
//router.get("/create", drinksController.create);
//
//export = router;

function init(app) {
    app.route('/drinks')
        .get(drinksController.getAll);

    app.route('/drinks/create')
        .get(drinksController.create);
}

export = init;