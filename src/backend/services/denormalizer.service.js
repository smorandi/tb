/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";

var _ = require("lodash");
var async = require("async");
var cqrs_denormalizer = require("cqrs-eventdenormalizer");

var eventBus = require("../services/eventbus.service");
var config = require("../config");
var logger = require("../utils/logger");

var cqrs_denormalizerService = cqrs_denormalizer(config.getViewModelOptions());
cqrs_denormalizerService.defineEvent(config.getDefaultEvtDefinitions());

var eventListener = function (event) {
    logger.trace("event-bus (domain-event) -> denormalizer -> handle():  " + event.name, event);
    cqrs_denormalizerService.handle(event);
};

function onInit() {
    logger.debug(JSON.stringify(cqrs_denormalizerService.getInfo(), null, 2));

    // on receiving an event from domain pass it to the denormalizer to handle it...
    logger.trace("onInit - hook on event-bus domain-events-channel");
    eventBus.removeListener(config.eventBusChannel_domainEvent, eventListener);
    eventBus.on(config.eventBusChannel_domainEvent, eventListener);

    // on receiving an event from denormalizer pass it to the event-bus to handle it...
    logger.trace("onInit - hook on denormalizer-events");
    cqrs_denormalizerService.onEvent(function (evt) {
        logger.trace("denormalizer -> event-bus (denormalizer-event): " + evt.name, evt);
        eventBus.emit(config.eventBusChannel_denormalizerEvent, evt);
    });
};

function init(callback) {
    cqrs_denormalizerService.init(function (err, warnings) {
        if (err) {
            callback(err);
        }
        else if (warnings) {
            // treat warnings as errors...
            callback(warnings);
        }
        else {
            onInit();
            callback(null);
        }
    });
};

function clear(callback) {
    cqrs_denormalizerService.clear(function (err) {
        callback(err);
    });
};

function replay(events, callback) {
    cqrs_denormalizerService.replay(events, function (err) {
        callback(err);
    });
};

module.exports = {init: init, clear: clear, replay: replay};
