/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var _ = require("lodash");
var logger = require("../../config/logger");
var hal = require("halberd");
var resourceUtils;
(function (resourceUtils) {
    function createBaseUrl(req, url) {
        return req.protocol + "://" + req.headers["host"] + url;
    }
    resourceUtils.createBaseUrl = createBaseUrl;
    function createSelfLink(baseUrl, entity) {
        var url = baseUrl;
        if (entity !== undefined && entity !== null) {
            url += "/" + entity.id;
        }
        return new hal.Link("self", url);
    }
    resourceUtils.createSelfLink = createSelfLink;
    function createDeleteLink(baseUrl, entity) {
        var url = baseUrl;
        if (entity !== undefined && entity !== null) {
            url += "/" + entity.id;
        }
        return new hal.Link("delete", url);
    }
    resourceUtils.createDeleteLink = createDeleteLink;
    function createUpdateLink(baseUrl, entity) {
        var url = baseUrl;
        if (entity !== undefined && entity !== null) {
            url += "/" + entity.id;
        }
        return new hal.Link("update", url);
    }
    resourceUtils.createUpdateLink = createUpdateLink;
    function createCreateLink(baseUrl) {
        return new hal.Link("create", baseUrl);
    }
    resourceUtils.createCreateLink = createCreateLink;
    function createCollectionResource(baseUrl, entities, collectionCrudLinks, entityCrudLinks, embedName) {
        logger.trace("creating collection resource");
        var collection = createResource(baseUrl, null, collectionCrudLinks);
        var name = (embedName === null || embedName === undefined) ? "items" : embedName;
        var embeddedResources = _.map(entities, function (entity) { return createResource(baseUrl, entity, entityCrudLinks); });
        collection.embed(name, embeddedResources);
        return collection;
    }
    resourceUtils.createCollectionResource = createCollectionResource;
    function createResource(baseUrl, entity, entityCrudLinks) {
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
    resourceUtils.createResource = createResource;
})(resourceUtils || (resourceUtils = {}));
module.exports = resourceUtils;
//# sourceMappingURL=resourceUtils.js.map