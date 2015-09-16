/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";
var cqrs_eventedCmd = require("evented-command");
var config = require("../config/config");

var cqrs_cmdService = cqrs_eventedCmd();
cqrs_cmdService.defineCommand(config.getDefaultCmdDefinitions());
cqrs_cmdService.defineEvent(config.getDefaultEvtDefinitions());

module.exports = cqrs_cmdService;
