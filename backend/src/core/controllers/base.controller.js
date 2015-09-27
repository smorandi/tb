/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var engine = require("../../engine/engine");
var logger = require("../../config/logger");
var eventBus = require("../utils/eventBus");
var hal = require("halberd");


var BaseController = (function () {
    function BaseController(repository, eventBus, domainService, cmdService) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.domainService = domainService;
        this.cmdService = cmdService;
    }

    return BaseController;
})();

module.exports = BaseController;