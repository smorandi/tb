/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";
var cqrs_viewmodel = require("viewmodel");
var config = require("../config/config");
var logger = require("../config/logger");

var repository;

function init(callback) {
    logger.debug("initializing viewmodel-service...");
    cqrs_viewmodel.read(config.getViewModelOptions(), function (err, mainRepository) {
        if (err) {
            callback(err);
        }
        else {
            repository = mainRepository;
            callback(null);
        }
    });
}

function getRepository(name) {
    logger.debug("getting repository by name: ", name);
    var repo = repository.extend({
        collectionName: name
    });

    if (config.getViewModelOptions().repository.type === "inmemory") {
        logger.trace("inmemory-repository conversion");
        repo = require("./viewmodels/" + name + "/collection").repository;
    }

    return repo;
}

module.exports = {service: cqrs_viewmodel, init: init, getRepository: getRepository};