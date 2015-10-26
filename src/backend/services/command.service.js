/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";

var _ = require("lodash");
var async = require("async");
var cqrs_eventedCmd = require("evented-command");

var config = require("../config");
var eventBus = require("./eventbus.service");

var cqrs_cmdService = cqrs_eventedCmd();
cqrs_cmdService.defineCommand(config.getDefaultCmdDefinitions());
cqrs_cmdService.defineEvent(config.getDefaultEvtDefinitions());

eventBus.on(config.eventBusChannel_denormalizerEvent, function (event) {
    cqrs_cmdService.emit("event", event);
});

cqrs_cmdService.on("command", function (command) {
    eventBus.emit(config.eventBusChannel_command, command);
});

cqrs_cmdService.sendCommands = function (sendCommandFns, callback) {
    async.eachSeries(sendCommandFns, function (cmd, callback) {
            cmd.go(function (event) {
                if (event[config.getDefaultEvtDefinitions().name] === "rejectedCommand") {
                    callback(event[config.getDefaultEvtDefinitions().payload].reason);
                }
                else {
                    callback(null);
                }
            });
        }, function (err) {
            callback(err);
        }
    );
}

module.exports = cqrs_cmdService;
