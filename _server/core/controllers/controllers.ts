/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import api = require("../models/api");
import impl = require("../models/impl");
import config = require("../../config/config");
import logger = require("../../config/logger");
import express = require("express");
import mongoose = require("mongoose");
import _ = require("lodash");

//______________________________________________________________________________________________________________________
// controller...
interface IController {
    list?(req:express.Request, res:express.Response, next:Function):void;
    read?(req:express.Request, res:express.Response, next:Function):void;
    create?(req:express.Request, res:express.Response, next:Function):void;
    update?(req:express.Request, res:express.Response, next:Function):void;
    remove?(req:express.Request, res:express.Response, next:Function):void;
}

class GenericController<E extends impl.IMixInDocument> implements IController {
    private repository:mongoose.Model<E>;

    constructor(repository:mongoose.Model<E>) {
        this.repository = repository;
    }

    public getRepository():mongoose.Model<E> {
        return this.repository;
    }

    public list(req:express.Request, res:express.Response, next:Function):void {
        // NOTE: MUST use lean here...we don't want any mongoose magic applied to the retrieved objects..
        this.repository.find({}).lean().exec((err:Error, docs:Array<E>) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.json(this.createResources(docs));
            }
        });
    }

    read(req:express.Request, res:express.Response, next:Function):void {
        this.repository.findById(req.params.id).exec((err:Error, doc:E) => {
            if (err) return next(err);
            if (!doc) return res.status(404).end();

            res.json(this.createResource(doc));
        })
    }

    public create(req:express.Request, res:express.Response, next:Function):void {
        this.repository.create(req.body, (err:Error, doc:E) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                // returning 201 with location to the created resource...
                res.status(201).location(this.getBaseUrl() + doc._id).end()
            }
        });
    }

    public update(req:express.Request, res:express.Response, next:Function):void {
        this.repository.findByIdAndUpdate(req.params.id, req.body, (err:Error, doc:E) => {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else if (!doc) {
                    return res.status(404).end();
                } else {
                    res.json(this.createResource(doc));
                }
            }
        );
    }

    public delete(req:express.Request, res:express.Response, next:Function):void {
        this.repository.findByIdAndRemove(req.params.id, (err:Error, model:E) => {
            if (err) return next(err);

            // returning 204 - NO content
            // http://www.restapitutorial.com/lessons/httpmethods.html
            res.status(204).end();
        });
    }

    public getBaseUrl():string {
        return "";
    }

    protected createSelfLink <E extends api.IEntity> (entity:E):api.ILink {
        return new api.Link("self", this.getBaseUrl() + entity._id, "GET");
    }

    protected createDeleteLink <E extends api.IEntity> (entity:E):api.ILink {
        return new api.Link("delete", this.getBaseUrl() + entity._id, "DELETE");
    }

    protected createUpdateLink<E extends api.IEntity> (entity:E):api.ILink {
        return new api.Link("update", this.getBaseUrl() + entity._id, "PUT");
    }

    protected createCreateLink <E extends api.IEntity> (entity:E):api.ILink {
        return new api.Link("create", this.getBaseUrl(), "POST");
    }

    private createResources <E extends api.IEntity > (entities:Array<E>) {
        var resources = [];
        entities.forEach((entity, index, entities) => resources.push(this.createResource(entity)));

        return resources;
    }

    private createResource <E extends api.IEntity > (entity:E) {
        logger.trace("creating resource out of entity")

        var selfLink = this.createSelfLink(entity);
        var deleteLink = this.createDeleteLink(entity);
        var updateLink = this.createUpdateLink(entity);
        var createLink = this.createCreateLink(entity);

        var links = [selfLink, deleteLink, updateLink, createLink];

        // add the links to the given entity...
        var resource = _.extend({}, entity, {_links: links});
        logger.trace("resource=", resource)
        return resource;
    }
}

//______________________________________________________________________________________________________________________
// drinks-controller
class DrinksController extends GenericController<impl.IDrinkDocument> {
    constructor() {
        super(impl.drinkRepository);
    }

    public getBaseUrl():string {
        return config.urls.drinks;
    }
}

export var drinksController = new DrinksController();

//______________________________________________________________________________________________________________________
// users-controller
class UsersController extends GenericController<impl.IUserDocument> {
    constructor() {
        super(impl.userRepository);
    }

    public getBaseUrl():string {
        return config.urls.users;
    }
}

export var usersController = new UsersController();

//______________________________________________________________________________________________________________________
// error handling...
/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
    var output;

    try {
        var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
};

/**
 * Get the error message from error object
 */
function getErrorMessage(err:any) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    return message;
}