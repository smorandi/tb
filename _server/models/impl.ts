/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />

"use strict";

import mongoose = require("mongoose");
import api = require("./api");

interface IDrinkModel extends api.IDrink, mongoose.Document {
    _id:any;
}

var drinkSchema = new mongoose.Schema({
    name: String,
    description: String,
    alcoholic: Boolean,
    quantity: String,
    price: Number,
    category: String
});

export var Drink = mongoose.model<IDrinkModel>("Drink", drinkSchema);