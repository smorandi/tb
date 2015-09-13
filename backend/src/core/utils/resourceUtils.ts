/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />

"use strict";

import logger = require("../../config/logger");
import express = require("express");
import _ = require("lodash");

var hal = require("halberd");

module resourceUtils {
    export function createBaseUrl(req:express.Request, baseUrl:string):string {
        return req.protocol + "://" + req.headers["host"] + baseUrl;
    }

    export function createSelfLink(req:express.Request, baseUrl:string, entity:any):any {
        return new hal.Link("self", createBaseUrl(req, baseUrl) + "/" + entity.id);
    }

    export function createDeleteLink(req:express.Request, baseUrl:string, entity?:any):any {

        var url:string = createBaseUrl(req, baseUrl);

        if (entity !== undefined) {
            url += "/" + entity.id;
        }

        return new hal.Link("delete", url);
    }

    export function createUpdateLink(req:express.Request, baseUrl:string, entity:any):any {
        return new hal.Link("update", createBaseUrl(req, baseUrl) + "/" + entity.id);
    }

    export function createCreateLink(req:express.Request, baseUrl:string):any {
        return new hal.Link("create", createBaseUrl(req, baseUrl));
    }

    export function createResources(req:express.Request, baseUrl:string, entities:Array<any>):Array<any> {
        logger.trace("creating collection resource");
        var collection = new hal.Resource({}, createBaseUrl(req, baseUrl));

        entities.forEach((entity, index, entities) => collection.embed("collection", createResource(req, baseUrl, entity)));
        collection.link(createCreateLink(req, baseUrl));
        //collection.link(createDeleteLink(req, baseUrl));

        logger.trace("collection-resource: ", collection)

        return collection;
    }

    export function createResource(req:express.Request, url:string, entity:any, supportedCrudLinks?:Array<string>):any {
        logger.trace("creating resource out of entity: ", entity);

        // have to do this conversion since entity might be a viewModel or a POJSO
        var _entity = entity;
        if((typeof entity.toJSON) === "function") {
            _entity = entity.toJSON();
        }

        var selfLink = createSelfLink(req, url, _entity);
        var resource = new hal.Resource(_entity, selfLink);

        // adding standard links
        if(supportedCrudLinks !== undefined) {
            if(_.includes(supportedCrudLinks, "create")){
                resource.link(createCreateLink(req, url));
            }
            if(_.includes(supportedCrudLinks, "delete")){
                resource.link(createDeleteLink(req, url, _entity));
            }
            if(_.includes(supportedCrudLinks, "update")){
                resource.link(createUpdateLink(req, url, _entity));
            }
        }

        logger.trace("resource created: ", resource)

        return resource;
    }
}

export = resourceUtils;