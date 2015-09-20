/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";
var cqrs_eventedCmd = require("evented-command");
var config = require("../config/config");
var eventBus = require("../core/utils/eventBus");

var cqrs_cmdService = cqrs_eventedCmd();
cqrs_cmdService.defineCommand(config.getDefaultCmdDefinitions());
cqrs_cmdService.defineEvent(config.getDefaultEvtDefinitions());


eventBus.on(config.eventBusChannel_denormalizerEvent, function (event) {
    cqrs_cmdService.emit("event", event);
});

cqrs_cmdService.on("command", function(command) {
    eventBus.emit(config.eventBusChannel_command, command);
});

cqrs_cmdService.handleCommandRejection = function (event, next, fn) {
    if (event[config.getDefaultEvtDefinitions().name] === "commandRejected") {
        next(event[config.getDefaultEvtDefinitions().payload].reason);
    }
    else {
        fn.call();
    }
}

module.exports = cqrs_cmdService;
