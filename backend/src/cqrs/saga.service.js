/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";

var _ = require("lodash");
var cqrs_saga = require("cqrs-saga");
var eventBus = require("../core/utils/eventBus");

var config = require("../config/config");
var logger = require("../config/logger");

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

function onInit() {
    logger.debug(JSON.stringify(cqrs_sagaService.getInfo(), null, 2));

    eventBus.on(config.eventBusChannel_domainEvent, function (event) {
        cqrs_sagaService.handle(event);
    });

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

module.exports = {service: cqrs_sagaService, init: init};
