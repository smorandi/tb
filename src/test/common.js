/**
 * Created by Stefano on 13.10.2015.
 */
"use strict";

var config = require("../backend/config");
var url = require("url");
var path = require("path");


var traverson = require("traverson");
var JsonHalAdapter = require("traverson-hal");
// register the traverson-hal plug-in for media type "application/hal+json"
traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
exports.traverson = traverson;

var serverUrl = "http://" + config.server.host + ":" + config.server.port + "/";

exports.rootUrl = url.resolve(serverUrl, config.urls.root);
exports.homeUrl = url.resolve(serverUrl, config.urls.home);
exports.customersUrl = url.resolve(serverUrl, config.urls.customers);
exports.drinksUrl = url.resolve(serverUrl, config.urls.drinks);
exports.basketsUrl = url.resolve(serverUrl, config.urls.baskets);

exports.importTest = function(name, caller, p) {
    describe(name, function () {
        require(path.join(caller, p));
    });
}