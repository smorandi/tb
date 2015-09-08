/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />

"use strict";

import logger = require("../../config/logger");
import express = require("express");

var hal = require("halberd");

module resourceUtils {
    function createBaseUrl(req:express.Request, baseUrl:string):string {
        return req.protocol + "://" + req.headers["host"] + baseUrl;
    }

    function createSelfLink(req:express.Request, baseUrl:string, entity:any):any {
        return new hal.Link("self", createBaseUrl(req, baseUrl) + "/" + entity.id);
    }

    function createDeleteLink(req:express.Request, baseUrl:string, entity?:any):any {

        var url:string = createBaseUrl(req, baseUrl);

        if (entity !== undefined) {
            url += "/" + entity.id;
        }

        return new hal.Link("delete", url);
    }

    function createUpdateLink(req:express.Request, baseUrl:string, entity:any):any {
        return new hal.Link("update", createBaseUrl(req, baseUrl) + "/" + entity.id);
    }

    function createCreateLink(req:express.Request, baseUrl:string):any {
        return new hal.Link("create", createBaseUrl(req, baseUrl));
    }

    export function createResources(req:express.Request, baseUrl:string, entities:Array<any>):Array<any> {
        logger.trace("creating collection resource");
        var collection = new hal.Resource({}, createBaseUrl(req, baseUrl));

        entities.forEach((entity, index, entities) => collection.embed("collection", createResource(req, baseUrl, entity)));
        collection.link(createCreateLink(req, baseUrl));
        //collection.link(createDeleteLink(req, baseUrl));

        logger.trace("collection-resource=", collection)

        return collection;
    }

    export function createResource(req:express.Request, baseUrl:string, entity:any):any {
        logger.trace("creating resource out of entity");

        var _entity = entity;
        if((typeof entity.toJSON) === "function") {
            _entity = entity.toJSON();
        }

        var selfLink = createSelfLink(req, baseUrl, _entity);
        var deleteLink = createDeleteLink(req, baseUrl, _entity);
        var updateLink = createUpdateLink(req, baseUrl, _entity);

        // have to do this covnerion since entity might be a viewModel or a POJSO

        var resource = new hal.Resource(_entity, selfLink);
        resource.link(deleteLink);
        resource.link(updateLink);

        logger.trace("resource=", resource)

        return resource;
    }
}

export = resourceUtils;