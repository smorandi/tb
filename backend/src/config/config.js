/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var path = require("path");
var _ = require("lodash");
exports.db = {
    uri: "mongodb://localhost:27017/tb",
    options: null
};
exports.app = {
    title: "Trinkbörse",
    description: "blah blah",
    keywords: "xxx"
};
exports.port = process.env.PORT || 3000;
exports.urls = {
    home: "/home",
    dashboard: "/dashboard",
    drinks: "/drinks",
    customers: "/customers",
    admins: "/admins",
    baskets: "/baskets",
    orders: "/orders",
    system: "/system"
};
exports.serverRoot = path.join(__dirname + "/../..");
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
var _domainOptions = {
    domainPath: exports.serverRoot + "/src/cqrs/domain/tb",
    commandRejectedEventName: "rejectedCommand",
    eventStore: {
        type: "mongodb",
        host: "localhost",
        port: 27017,
        dbName: "domain",
        eventsCollectionName: "events",
        snapshotsCollectionName: "snapshots",
        transactionsCollectionName: "transactions",
        timeout: 10000 // optional
    }
};
function getDomainOptions() {
    return _.clone(_domainOptions);
}
exports.getDomainOptions = getDomainOptions;
var _viewModelOptions = {
    denormalizerPath: exports.serverRoot + "/src/cqrs/viewmodels",
    //commandRejectedEventName: "rejectedCommand",
    repository: {
        type: "mongodb",
        dbName: "viewmodel"
    },
    revisionGuard: {
        queueTimeout: 1000,
        queueTimeoutMaxLoops: 5,
        type: "mongodb",
        //host: 'localhost',                          // optional
        //port: 6379,                                 // optional
        //db: 0,                                      // optional
        prefix: "viewmodel_revision"
    }
};
function getViewModelOptions() {
    return _.clone(_viewModelOptions);
}
exports.getViewModelOptions = getViewModelOptions;
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
var _sagaOptions = {
    sagaPath: exports.serverRoot + "/src/cqrs/domain/tb/sagas"
};
function getSagaOptions() {
    return _.clone(_sagaOptions);
}
exports.getSagaOptions = getSagaOptions;
//# sourceMappingURL=config.js.map