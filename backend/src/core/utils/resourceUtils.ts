/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />

"use strict";

import express = require("express");
import _ = require("lodash");
import url = require("url");
import logger = require("../../config/logger");

var hal = require("halberd");

module resourceUtils {
    export function createBaseUrl(req:express.Request, url:string):string {
        return req.protocol + "://" + req.headers["host"] + url;
    }

    export function createSelfLink(baseUrl:string, entity?:any):any {
        var url:string = baseUrl;
        if (entity !== undefined && entity !== null) {
            url += "/" + entity.id;
        }

        return new hal.Link("self", url);
    }

    export function createDeleteLink(baseUrl:string, entity?:any):any {

        var url:string = baseUrl;

        if (entity !== undefined && entity !== null) {
            url += "/" + entity.id;
        }

        return new hal.Link("delete", url);
    }

    export function createUpdateLink(baseUrl:string, entity?:any):any {
        var url:string = baseUrl;

        if (entity !== undefined && entity !== null) {
            url += "/" + entity.id;
        }

        return new hal.Link("update", url);
    }

    export function createCreateLink(baseUrl:string):any {
        return new hal.Link("create", baseUrl);
    }

    export function createCollectionResource(baseUrl:string, entities:Array<any>, collectionCrudLinks?:string, entityCrudLinks?:string, embedName?:string):any {
        logger.trace("creating collection resource");
        var collection = createResource(baseUrl, null, collectionCrudLinks);

        var name = (embedName === null || embedName === undefined) ? "items" : embedName;

        var embeddedResources = _.map(entities, entity => createResource(baseUrl, entity, entityCrudLinks));
        collection.embed(name, embeddedResources);

        return collection;
    }


    export function createResource(baseUrl:string, entity?:any, entityCrudLinks?:string):any {
        logger.trace("creating resource out of entity: ", entity);

        // always convert to a JSON object if it has a toJSON function...
        if (entity !== undefined && entity !== null) {
            if (typeof entity.toJSON === "function") {
                entity = entity.toJSON();
            }
        }

        var selfLink = createSelfLink(baseUrl, entity);
        var resource = new hal.Resource(entity, selfLink);

        // adding standard links
        if (entityCrudLinks !== undefined && entityCrudLinks !== null) {
            if (entityCrudLinks.indexOf("c") !== -1) {
                resource.link(createCreateLink(baseUrl));
            }
            if (entityCrudLinks.indexOf("d") !== -1) {
                resource.link(createDeleteLink(baseUrl, entity));
            }
            if (entityCrudLinks.indexOf("u") !== -1) {
                resource.link(createUpdateLink(baseUrl, entity));
            }
        }

        logger.trace("resource created: ", resource);

        return resource;
    }
}

export = resourceUtils;