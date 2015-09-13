/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var logger = require("../../config/logger");
var _ = require("lodash");
var hal = require("halberd");
var resourceUtils;
(function (resourceUtils) {
    function createBaseUrl(req, baseUrl) {
        return req.protocol + "://" + req.headers["host"] + baseUrl;
    }
    resourceUtils.createBaseUrl = createBaseUrl;
    function createSelfLink(req, baseUrl, entity) {
        return new hal.Link("self", createBaseUrl(req, baseUrl) + "/" + entity.id);
    }
    resourceUtils.createSelfLink = createSelfLink;
    function createDeleteLink(req, baseUrl, entity) {
        var url = createBaseUrl(req, baseUrl);
        if (entity !== undefined) {
            url += "/" + entity.id;
        }
        return new hal.Link("delete", url);
    }
    resourceUtils.createDeleteLink = createDeleteLink;
    function createUpdateLink(req, baseUrl, entity) {
        return new hal.Link("update", createBaseUrl(req, baseUrl) + "/" + entity.id);
    }
    resourceUtils.createUpdateLink = createUpdateLink;
    function createCreateLink(req, baseUrl) {
        return new hal.Link("create", createBaseUrl(req, baseUrl));
    }
    resourceUtils.createCreateLink = createCreateLink;
    function createResources(req, baseUrl, entities) {
        logger.trace("creating collection resource");
        var collection = new hal.Resource({}, createBaseUrl(req, baseUrl));
        entities.forEach(function (entity, index, entities) { return collection.embed("collection", createResource(req, baseUrl, entity)); });
        collection.link(createCreateLink(req, baseUrl));
        //collection.link(createDeleteLink(req, baseUrl));
        logger.trace("collection-resource: ", collection);
        return collection;
    }
    resourceUtils.createResources = createResources;
    function createResource(req, url, entity, supportedCrudLinks) {
        logger.trace("creating resource out of entity: ", entity);
        // have to do this conversion since entity might be a viewModel or a POJSO
        var _entity = entity;
        if ((typeof entity.toJSON) === "function") {
            _entity = entity.toJSON();
        }
        var selfLink = createSelfLink(req, url, _entity);
        var resource = new hal.Resource(_entity, selfLink);
        // adding standard links
        if (supportedCrudLinks !== undefined) {
            if (_.includes(supportedCrudLinks, "create")) {
                resource.link(createCreateLink(req, url));
            }
            if (_.includes(supportedCrudLinks, "delete")) {
                resource.link(createDeleteLink(req, url, _entity));
            }
            if (_.includes(supportedCrudLinks, "update")) {
                resource.link(createUpdateLink(req, url, _entity));
            }
        }
        logger.trace("resource created: ", resource);
        return resource;
    }
    resourceUtils.createResource = createResource;
})(resourceUtils || (resourceUtils = {}));
module.exports = resourceUtils;
//# sourceMappingURL=resourceUtils.js.map