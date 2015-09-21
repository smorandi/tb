/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import path = require("path");
import _ = require("lodash");

export var db = {
    uri: "mongodb://localhost:27017/tb",
    options: null,
};

export var app = {
    title: "Trinkbörse",
    description: "blah blah",
    keywords: "xxx"
};

export var port = process.env.PORT || 3000;

export var urls = {
    home: "/home",
    dashboard: "/dashboard",
    drinks: "/drinks",
    customers: "/customers",
    admins: "/admins",
    baskets: "/baskets",
    orders: "/orders",
    system: "/system",
};

export var serverRoot = path.join(__dirname + "/../..");

//=============================================================================
// EventBus configurations...
//-----------------------------------------------------------------------------
export var eventBusChannel_command:string = "command";
export var eventBusChannel_domainEvent:string = "domain-event";
export var eventBusChannel_denormalizerEvent:string = "denormalizer-event";

//=============================================================================
// WebSocket configurations...
//-----------------------------------------------------------------------------
export var websocketChannel_dashboard:string = "dashboard";


//=============================================================================
// CQRS configurations...
//-----------------------------------------------------------------------------
// make sure to provide defensive coding by functions that _clone_ the configs
// since they might get overwritten otherwise...

var _domainOptions = {
    domainPath: serverRoot + "/src/cqrs/domain/tb",
    commandRejectedEventName: "rejectedCommand",
    eventStore: {
        type: "mongodb",
        host: "localhost",                          // optional
        port: 27017,                                // optional
        dbName: "domain",                           // optional
        eventsCollectionName: "events",             // optional
        snapshotsCollectionName: "snapshots",       // optional
        transactionsCollectionName: "transactions", // optional
        timeout: 10000                              // optional
    },
};
export function getDomainOptions() {
    return _.clone(_domainOptions);
}

var _viewModelOptions = {
    denormalizerPath: serverRoot + "/src/cqrs/viewmodels",
    //commandRejectedEventName: "rejectedCommand",
    repository: {
        type: "mongodb",
        dbName: "viewmodel"
    },
    revisionGuard: {
        queueTimeout: 1000,                         // optional, timeout for non-handled events in the internal in-memory queue
        queueTimeoutMaxLoops: 5,                     // optional, maximal loop count for non-handled event in the internal in-memory queue

        type: "mongodb",
        //host: 'localhost',                          // optional
        //port: 6379,                                 // optional
        //db: 0,                                      // optional
        prefix: "viewmodel_revision",               // optional
        //timeout: 10000                              // optional
        // password: 'secret'                          // optional
    }

};
export function getViewModelOptions() {
    return _.clone(_viewModelOptions);
}

var _defaultCmdDefinitions = {
    id: "id",
    name: "name",
    aggregate: "aggregate.name",
    aggregateId: "aggregate.id",
    payload: "payload",
    revision: "aggregate.revision",
    //context: "aggregate.context"
};
export function getDefaultCmdDefinitions() {
    return _.clone(_defaultCmdDefinitions);
}

var _defaultEvtDefinitions = {
    correlationId: "commandId",
    id: "id",
    name: "name",
    aggregate: "aggregate.name",
    aggregateId: "aggregate.id",
    payload: "payload",
    revision: "aggregate.revision",
    //context: "aggregate.context"
};
export function getDefaultEvtDefinitions() {
    return _.clone(_defaultEvtDefinitions);
}

var _sagaOptions = {
    sagaPath: serverRoot + "/src/cqrs/domain/tb/sagas",

    //sagaStore: {
    //    type: "mongodb",
    //    host: "localhost",                          // optional
    //    port: 27017,                                // optional
    //    dbName: "domain",                           // optional
    //    collectionName: "sagas",                    // optional
    //    timeout: 10000                              // optional
    //},
};

export function getSagaOptions() {
    return _.clone(_sagaOptions);
}