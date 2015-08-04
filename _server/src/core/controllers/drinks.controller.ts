/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import generic = require("./generic.controller");
import config = require("../../config/config");
import impl = require("../models/impl");

class DrinksController extends generic.GenericController<impl.IDrinkDocument> {
    constructor() {
        super(impl.drinkRepository);
    }

    protected getBaseUrl():string {
        return config.urls.drinks;
    }
}

var drinksController = new DrinksController();
export = drinksController;