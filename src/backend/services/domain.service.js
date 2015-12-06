/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";

var _ = require("lodash");
var cqrs_domain = require("cqrs-domain");
var config = require("../config");
var eventBus = require("../services/eventbus.service");
var logger = require("../utils/logger");

var cqrs_domainService = cqrs_domain(config.getDomainOptions());
cqrs_domainService.defineCommand(config.getDefaultCmdDefinitions());
cqrs_domainService.defineEvent(config.getDefaultEvtDefinitions());

var commandListener = function (command) {
    logger.trace("domain-service -- received command " + command.name + " from event-bus", command);
    cqrs_domainService.handle(command, function (err) {
        if (err) {
            logger.error("command error: ", err);
        }
    });
};

function onInit() {
    logger.debug(JSON.stringify(cqrs_domainService.getInfo(), null, 2));

    // on receiving a command from the event-bus pass it to the domain to handle it...
    logger.trace("onInit - hook on event-bus command-channel");
    eventBus.removeListener(config.eventBusChannel_command, commandListener);
    eventBus.on(config.eventBusChannel_command, commandListener);

    // on receiving an event from domain pass it to the event-bus...
    logger.trace("onInit - hook on event-bus for domain-events-channel");
    cqrs_domainService.onEvent(function (event) {
        logger.trace("event -> event-bus: " + event.name, event);
        eventBus.emit(config.eventBusChannel_domainEvent, event);
    });
}

function init(callback) {
    cqrs_domainService.init(function (err) {
        if (err) {
            callback(err);
        }
        else {
            onInit();
            callback(null);
        }
    });
}

function getEvents(callback) {
    cqrs_domainService.eventStore.getEvents(callback);
}

function clear(callback) {
    cqrs_domainService.eventStore.store.clear(callback);
}

module.exports = {init: init, getEvents: getEvents, clear: clear};
