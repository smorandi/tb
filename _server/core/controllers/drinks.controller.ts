/**
 * Created by Stefano on 24.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import mongoose = require("mongoose");
import errorHandler = require("./errors.controller");

import api = require("../models/api");
import impl = require("../models/impl");
import utils = require("../utils/utils");
import config = require("../../config/config");

function createDrinkResource(drink:api.IDrink) {
    var selfLink = new api.Link("self", config.urls.drinks + drink._id, "GET");
    var deleteLink = new api.Link("delete", config.urls.drinks + drink._id, "DELETE");
    var updateLink = new api.Link("update", config.urls.drinks + drink._id, "PUT");
    var createLink = new api.Link("create", config.urls.drinks, "POST");

    var links = [selfLink, deleteLink, updateLink, createLink];

    return utils.createFromEntity<api.IDrinkResource>(drink, links);
}

function createDrinkResources(drinks:Array<api.IDrink>) {
    var resources = [];
    drinks.forEach((obj, index, notes) => resources.push(createDrinkResource(obj)));

    return resources;
}

export function getAll(req, res, next) {
    // NOTE: MUST use lean here...we don't want any mongoose magic applied to the retrieved objects..
    impl.Drink.find({}).lean().exec((err:Error, drinks:Array<api.IDrink>) => {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.format({
                'application/json': function () {
                    res.json(createDrinkResources(drinks));
                },
            });
        }
    });
}

export function create(req, res) {
    var drink = new impl.Drink({
        "name": "xxx",
        "description": "desc",
        "alcoholic": true,
        "quantity": "3dl",
        "price": 5,
        "category": "Cocktail"
    });

    drink.save(err => {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // returning 201 with location to the created resource...
            res.status(201).location(drink._id).send();
        }
    });
};


//function createDrinkResource(drink:IDrink) {
//    return null;
//}
//
//function createDrinkResources(drinks:Array<IDrink>) {
//    var resources = [];
//    drinks.forEach(function (obj, index, notes) {
//        resources.push(createDrinkResource(obj));
//    });
//
//    return resources;
//}
//
//export function getDrinks(req, res, next) {
//    repositories.drinkRepository.getAll(function (err, drinks) {
//        if (err) return next(err);
//
//        res.format({
//            'application/json': function () {
//                res.json(createDrinkResources(drinks));
//            },
//        });
//    })
//}
//
//export function createDrink(req, res, next) {
//    repositories.drinkRepository.create(null, function (err, drink:IDrink) {
//            if (err) return next(err);
//
//            // returning 201 with location to the created resource...
//            res.status(201).location(drink.getId()).send();
//        }
//    );
//}