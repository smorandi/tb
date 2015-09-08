/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var logger = require("../../config/logger");
var hal = require("halberd");
var resourceUtils;
(function (resourceUtils) {
    function createBaseUrl(req, baseUrl) {
        return req.protocol + "://" + req.headers["host"] + baseUrl;
    }
    function createSelfLink(req, baseUrl, entity) {
        return new hal.Link("self", createBaseUrl(req, baseUrl) + "/" + entity.id);
    }
    function createDeleteLink(req, baseUrl, entity) {
        var url = createBaseUrl(req, baseUrl);
        if (entity !== undefined) {
            url += "/" + entity.id;
        }
        return new hal.Link("delete", url);
    }
    function createUpdateLink(req, baseUrl, entity) {
        return new hal.Link("update", createBaseUrl(req, baseUrl) + "/" + entity.id);
    }
    function createCreateLink(req, baseUrl) {
        return new hal.Link("create", createBaseUrl(req, baseUrl));
    }
    function createResources(req, baseUrl, entities) {
        logger.trace("creating collection resource");
        var collection = new hal.Resource({}, createBaseUrl(req, baseUrl));
        entities.forEach(function (entity, index, entities) { return collection.embed("collection", createResource(req, baseUrl, entity)); });
        collection.link(createCreateLink(req, baseUrl));
        //collection.link(createDeleteLink(req, baseUrl));
        logger.trace("collection-resource=", collection);
        return collection;
    }
    resourceUtils.createResources = createResources;
    function createResource(req, baseUrl, entity) {
        logger.trace("creating resource out of entity");
        var _entity = entity;
        if ((typeof entity.toJSON) === "function") {
            _entity = entity.toJSON();
        }
        var selfLink = createSelfLink(req, baseUrl, _entity);
        var deleteLink = createDeleteLink(req, baseUrl, _entity);
        var updateLink = createUpdateLink(req, baseUrl, _entity);
        // have to do this covnerion since entity might be a viewModel or a POJSO
        var resource = new hal.Resource(_entity, selfLink);
        resource.link(deleteLink);
        resource.link(updateLink);
        logger.trace("resource=", resource);
        return resource;
    }
    resourceUtils.createResource = createResource;
})(resourceUtils || (resourceUtils = {}));
module.exports = resourceUtils;
//# sourceMappingURL=resourceUtils.js.map