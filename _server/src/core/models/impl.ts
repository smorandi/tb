/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="./api.ts" />

import mongoose = require("mongoose");

module impl {
    "use strict";

    export interface IMixInDocument extends api.IEntity, mongoose.Document {
        _id:any;
    }

//______________________________________________________________________________________________________________________
// drink...
    export interface IDrinkDocument extends api.IDrink, IMixInDocument {
        _id:any;
    }

    var drinkSchema = new mongoose.Schema({
        name: {type: String, required: true},
        description: String,
        alcoholic: Boolean,
        quantity: String,
        price: {type: Number, required: true},
        category: {type: String, enum: ["SoftDrink", "Beer", "Cocktail"]}
    }, {versionKey: false});

    export var drinkRepository = mongoose.model<IDrinkDocument>("Drink", drinkSchema);


//______________________________________________________________________________________________________________________
// user...
    export interface IUserDocument extends api.IUser, IMixInDocument {
        _id:any;
    }

    var userSchema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        role: {type: String, enum: ["Customer", "Manager"]},
        joinDate: Date
    }, {versionKey: false});

    export var userRepository = mongoose.model<IUserDocument>("User", userSchema);
}

export = impl;