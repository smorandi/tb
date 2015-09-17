/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";

var _ = require("lodash");
var cqrs_domain = require("cqrs-domain");
var cmdService = require("./command.service");
var config = require("../config/config");
var eventBus = require("../core/utils/eventBus");
var logger = require("../config/logger");

var cqrs_domainService = cqrs_domain(config.getDomainOptions());
cqrs_domainService.defineCommand(config.getDefaultCmdDefinitions());
cqrs_domainService.defineEvent(config.getDefaultEvtDefinitions());

function onInit() {
    logger.debug(JSON.stringify(cqrs_domainService.getInfo(), null, 2));

    // on receiving a command from the event-bus pass it to the domain to handle it...
    logger.trace("onInit - hook on event-bus command-channel");
    cmdService.on(config.eventBusChannel_command, function (cmd) {
        logger.debug("domain-service -- received command " + cmd.name + " from event-bus", cmd);
        cqrs_domainService.handle(cmd, function (err) {
            if (err) {
                logger.error("command error: ", err);
            }
            else {
                logger.info("command handled: " + cmd.name);
            }
        });
    });

    // on receiving an event from domain pass it to the event-bus...
    logger.trace("onInit - hook on event-bus for domain-events-channel");
    cqrs_domainService.onEvent(function (evt) {
        logger.debug("event -> event-bus: " + evt.name, evt);
        eventBus.emit(config.eventBusChannel_domainEvent, evt);
    });
}

function init(callback) {
    logger.debug("initializing domain-service...");
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

module.exports = {service: cqrs_domainService, eventStore: cqrs_domainService.eventStore, init: init};
