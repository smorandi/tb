/**
 * Created by Stefano on 25.07.2015.
 */
"use strict";

var path = require("path");
var _ = require("lodash");

exports.logger = {
    level: "info",
    connectLevel: "debug"
};

exports.db = {
    uri: "mongodb://localhost:27017/tb",
    options: null
};

exports.app = {
    title: "Trinkbörse",
    description: "blah blah",
    keywords: "xxx"
};

exports.server= {
    port: process.env.PORT || 3000,
    host: "localhost",
    backlog: 511,
}
exports.urls = {
    root: "/root",
    home: "/home",
    dashboard: "/dashboard",
    drinks: "/drinks",
    customers: "/customers",
    admins: "/admins",
    baskets: "/baskets",
    orders: "/orders",
    system: "/system",
    pricing: "/pricing"
};

exports.serverRoot = path.join(__dirname + "/..");

//=============================================================================
// Content-Types...
//-----------------------------------------------------------------------------
exports.contentTypes = {
    json: "application/json",
    hal: "application/hal+json"
};

//=============================================================================
// Content-Types...
//-----------------------------------------------------------------------------
exports.userTypes = {
    root: "root",
    admin: "admin",
    customer: "customer"
};

//=============================================================================
// EventBus configurations...
//-----------------------------------------------------------------------------
exports.eventBusChannel_command = "command";
exports.eventBusChannel_domainEvent = "domain-event";
exports.eventBusChannel_denormalizerEvent = "denormalizer-event";

//=============================================================================
// WebSocket configurations...
//-----------------------------------------------------------------------------
exports.websocketChannel_dashboard = "dashboard";


//=============================================================================
// CQRS configurations...
//-----------------------------------------------------------------------------
// make sure to provide defensive coding by functions that _clone_ the configs
// since they might get overwritten otherwise...


// Domain-----------------------------------
var _domainOptions = {
    domainPath: __dirname + "/cqrs/domain/tb",
    commandRejectedEventName: "rejectedCommand",
    eventStore: {
        type: "mongodb",
        host: "localhost",
        port: 27017,
        dbName: "domain",
        eventsCollectionName: "events",
        snapshotsCollectionName: "snapshots",
        transactionsCollectionName: "transactions",
        timeout: 1000
    }
};

function getDomainOptions() {
    return _.clone(_domainOptions);
}

exports.getDomainOptions = getDomainOptions;

// Sagas-----------------------------------
var _sagaOptions = {
    sagaPath: __dirname + "/cqrs/domain/tb/sagas",
    sagaStore: {
        type: "mongodb",
        host: "localhost",
        port: 27017,
        dbName: "domain",
        collectionName: "sagas",
        timeout: 10000
    },
    revisionGuard: {
        type: "mongodb",
        host: "localhost",
        port: 27017,
        prefix: "saga_revision",
        timeout: 10000
    }
};

function getSagaOptions() {
    return _.clone(_sagaOptions);
}

exports.getSagaOptions = getSagaOptions;

// View Models-----------------------------------
var _viewModelOptions = {
    denormalizerPath: __dirname + "/cqrs/viewmodels",
    //commandRejectedEventName: "rejectedCommand",
    repository: {
        type: "mongodb",
        dbName: "viewmodel"
    },
    revisionGuard: {
        type: "mongodb",
        host: "localhost",
        port: 27017,
        prefix: "viewmodel_revision"
    }
};

function getViewModelOptions() {
    return _.clone(_viewModelOptions);
}

exports.getViewModelOptions = getViewModelOptions;

// Commands-----------------------------------
var _defaultCmdDefinitions = {
    id: "id",
    name: "name",
    aggregate: "aggregate.name",
    aggregateId: "aggregate.id",
    payload: "payload",
    revision: "aggregate.revision"
};

function getDefaultCmdDefinitions() {
    return _.clone(_defaultCmdDefinitions);
}

exports.getDefaultCmdDefinitions = getDefaultCmdDefinitions;

// Events-----------------------------------
var _defaultEvtDefinitions = {
    correlationId: "commandId",
    id: "id",
    name: "name",
    aggregate: "aggregate.name",
    aggregateId: "aggregate.id",
    payload: "payload",
    revision: "aggregate.revision"
};

function getDefaultEvtDefinitions() {
    return _.clone(_defaultEvtDefinitions);
}

exports.getDefaultEvtDefinitions = getDefaultEvtDefinitions;