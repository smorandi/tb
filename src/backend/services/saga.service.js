/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";

var _ = require("lodash");
var cqrs_saga = require("cqrs-saga");
var eventBus = require("../services/eventbus.service");

var config = require("../config");
var logger = require("../utils/logger");

var cqrs_sagaService = cqrs_saga(config.getSagaOptions());

cqrs_sagaService.defineCommand({
    id: "id",
    meta: "meta"
});
cqrs_sagaService.defineEvent({
    name: "name",
    aggregate: "aggregate.name",
    aggregateId: "aggregate.id"
});

var eventListener = function (event) {
    cqrs_sagaService.handle(event);
};

function onInit() {
    logger.debug(JSON.stringify(cqrs_sagaService.getInfo(), null, 2));

    eventBus.removeListener(config.eventBusChannel_domainEvent, eventListener);
    eventBus.on(config.eventBusChannel_domainEvent, eventListener);

    cqrs_sagaService.onCommand(function (command) {
        eventBus.emit(config.eventBusChannel_command, command);
    });
}

function init(callback) {
    logger.debug("initializing saga-service...");
    cqrs_sagaService.init(function (err) {
        if (err) {
            callback(err);
        }
        else {
            onInit();
            callback(null);
        }
    });
}

function clear(callback) {
    cqrs_sagaService.sagaStore.clear(callback);
}

module.exports = {init: init, clear: clear};
