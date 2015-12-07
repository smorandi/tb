/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />

"use strict";

var express = require("express");
var _ = require("lodash");
var url = require("url");
var logger = require("../utils/logger");

var hal = require("halberd");

function createBaseUrl(req, url) {
    return req.protocol + "://" + req.headers.host + url;
}

function createSelfLink(baseUrl, entity) {
    var url = baseUrl;
    if (entity !== undefined && entity !== null) {
        url += "/" + entity.id;
    }

    return new hal.Link("self", url);
}

function createDeleteLink(baseUrl, entity) {

    var url = baseUrl;

    if (entity !== undefined && entity !== null) {
        url += "/" + entity.id;
    }

    return new hal.Link("delete", url);
}

function createUpdateLink(baseUrl, entity) {
    var url = baseUrl;

    if (entity !== undefined && entity !== null) {
        url += "/" + entity.id;
    }

    return new hal.Link("update", url);
}

function createCreateLink(baseUrl) {
    return new hal.Link("create", baseUrl);
}

function createCollectionResource(baseUrl, entities, collectionCrudLinks, entityCrudLinks, embedName) {
    logger.trace("creating collection resource");
    var collection = createResource(baseUrl, null, collectionCrudLinks);

    var name = (embedName === null || embedName === undefined) ? "items" : embedName;

    var embeddedResources = _.map(entities, function (entity) {
        return createResource(baseUrl, entity, entityCrudLinks);
    });
    collection.embed(name, embeddedResources);

    return collection;
}


function createResource(baseUrl, entity, entityCrudLinks) {
    logger.trace("creating resource out of entity: ", entity);

    // always convert to a JSON object if it has a toJSON function...
    if (entity) {
        if (typeof entity.toJSON === "function") {
            entity = entity.toJSON();
        }
    }

    var selfLink = createSelfLink(baseUrl, entity);
    var resource = new hal.Resource(entity, selfLink);

    // adding standard links
    if (entityCrudLinks) {
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

module.exports = {
    createBaseUrl: createBaseUrl,
    createSelfLink: createSelfLink,
    createDeleteLink: createDeleteLink,
    createUpdateLink: createUpdateLink,
    createCreateLink: createCreateLink,
    createCollectionResource: createCollectionResource,
    createResource: createResource
};