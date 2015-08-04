/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />

"use strict";

import impl = require("../models/impl");
import config = require("../../config/config");
import logger = require("../../config/logger");
import express = require("express");
import mongoose = require("mongoose");
import _ = require("lodash");

var hal = require("halberd");

//______________________________________________________________________________________________________________________
// controller...
export interface IController {
    list?(req:express.Request, res:express.Response, next:Function):void;
    read?(req:express.Request, res:express.Response, next:Function):void;
    create?(req:express.Request, res:express.Response, next:Function):void;
    update?(req:express.Request, res:express.Response, next:Function):void;
    remove?(req:express.Request, res:express.Response, next:Function):void;
}

export class GenericController<E extends impl.IMixInDocument> implements IController {
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
                    message: GenericController.getErrorMessage(err)
                });
            } else {
                res.format({
                    "application/hal+json": () =>  res.json(this.createResources(req, docs)),
                    "application/json": () =>  res.json(docs)
                });
            }
        });
    }

    public read(req:express.Request, res:express.Response, next:Function):void {
        this.repository.findById(req.params.id).lean().exec((err:Error, doc:E) => {
            if (err) return next(err);
            if (!doc) return res.status(404).end();

            res.format({
                "application/hal+json": () =>  res.json(this.createResource(req, doc)),
                "application/json": () =>  res.json(doc)
            });
        })
    }

    public create(req:express.Request, res:express.Response, next:Function):void {
        this.repository.create(req.body, (err:Error, doc:E) => {
            if (err) {
                return res.status(400).send({
                    message: GenericController.getErrorMessage(err)
                });
            } else {
                // returning 201 with location to the created resource...
                res.status(201).location(this._getBaseUrl(req) + "/" + doc._id).end()
            }
        });
    }

    public update(req:express.Request, res:express.Response, next:Function):void {
        this.repository.findByIdAndUpdate(req.params.id, req.body).lean().exec((err:Error, doc:E) => {
                if (err) {
                    return res.status(400).send({
                        message: GenericController.getErrorMessage(err)
                    });
                } else if (!doc) {
                    return res.status(404).end();
                } else {
                    res.format({
                        "application/hal+json": () => res.json(this.createResource(req, doc)),
                        "application/json": () => res.json(doc),
                    });
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

    private _getBaseUrl(req:express.Request):string {
        return req.headers["host"] + this.getBaseUrl();
    }

    protected getBaseUrl():string {
        throw new Error("method must be overridden and implemented");
    }

    protected createSelfLink <E extends api.IEntity> (req:express.Request, entity:E):any {
        return new hal.Link("self", this._getBaseUrl(req) + "/" + entity._id);
    }

    protected createDeleteLink <E extends api.IEntity> (req:express.Request, entity:E):any {
        return new hal.Link("delete", this._getBaseUrl(req) + "/" + entity._id);
    }

    protected createUpdateLink<E extends api.IEntity> (req:express.Request, entity:E):any {
        return new hal.Link("update", this._getBaseUrl(req) + "/" + entity._id);
    }

    protected createCreateLink <E extends api.IEntity> (req:express.Request, entity:E):any {
        return new hal.Link("create", this._getBaseUrl(req));
    }

    private createResources <E extends api.IEntity> (req:express.Request, entities:Array<E>):Array<any> {
        var collection = new hal.Resource({}, this._getBaseUrl(req));

        entities.forEach((entity, index, entities) => collection.embed("collection", this.createResource(req, entity)));

        return collection;
    }

    private createResource <E extends api.IEntity> (req:express.Request, entity:E):any {
        logger.trace("creating resource out of entity")

        var selfLink = this.createSelfLink(req, entity);
        var deleteLink = this.createDeleteLink(req, entity);
        var updateLink = this.createUpdateLink(req, entity);
        var createLink = this.createCreateLink(req, entity);

        var links = [selfLink, deleteLink, updateLink, createLink];

        // add the links to the given entity...
        //var resource = _.extend({}, entity, {_links: links});
        //return <api.IResource>resource;

        var resource = new hal.Resource(entity);
        resource.link(selfLink);
        resource.link(deleteLink);
        resource.link(updateLink);
        resource.link(createLink);

        logger.trace("resource=", resource)

        return resource;
    }

    //public resolveById(req:express.Request, res:express.Response, next:Function, id:any):void {
    //    var x:any = mongoose.Types.ObjectId;
    //    if (!x.isValid(id)) {
    //        res.status(400).send({
    //            message: "ID of requested resource is invalid"
    //        });
    //    } else {
    //        this.repository.findById(id).lean().exec((err, doc) => {
    //            if (err) return next(err);
    //            if (!doc) {
    //                res.status(404).send({
    //                    message: "resource not found"
    //                });
    //            } else {
    //                req.body = doc;
    //                next();
    //            }
    //        });
    //    }
    //}

    private static getUniqueErrorMessage(err):string {
        var output;

        try {
            var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
            output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

        } catch (ex) {
            output = 'Unique field already exists';
        }

        return output;
    }

    private static getErrorMessage(err:any):string {
        var message = '';

        if (err.code) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = GenericController.getUniqueErrorMessage(err);
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
}