/**
 * Created by Stefano on 16.09.2015.
 */
"use strict";

var _ = require("lodash");
var async = require("async");
var cqrs_denormalizer = require("cqrs-eventdenormalizer");

var cmdService = require("./command.service");
var domainService = require("./domain.service");
var config = require("../config/config");
var eventBus = require("../core/utils/eventBus");
var logger = require("../config/logger");

var cqrs_denormalizerService = cqrs_denormalizer(config.getViewModelOptions());
cqrs_denormalizerService.defineEvent(config.getDefaultEvtDefinitions());

function onInit() {
    logger.debug(JSON.stringify(cqrs_denormalizerService.getInfo(), null, 2));

    // on receiving an event from domain pass it to the denormalizer to handle it...
    logger.trace("onInit - hook on event-bus domain-events-channel");
    eventBus.on(config.eventBusChannel_domainEvent, function (evt) {
        logger.info("event-bus -> denormalizer -> handle():  " + evt.name, evt);
        cqrs_denormalizerService.handle(evt);
    });

    // on receiving an event from denormalizer pass it to the event-bus to handle it...
    logger.trace("onInit - hook on denormalizer-events");
    cqrs_denormalizerService.onEvent(function (evt) {
        logger.debug("denormalizer -> cmd-service: " + evt.name, evt);
        cmdService.emit(config.eventBusChannel_denormalizerEvent, evt);
    });
}

function init(callback) {
    logger.debug("initializing denormalizer-service...");

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
}

function replay(callback) {
    logger.debug("start replaying events...");

    var tasks = [
        function (callback) {
            logger.trace("clearing view-models...");
            cqrs_denormalizerService.clear(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null);
                }
            });
        },
        function(callback) {
            logger.trace("retrieving events...");
            domainService.eventStore.getEvents(function (err, evts) {
                if (err) {
                    logger.error("error on retrieving events: ", err);
                    callback(err);
                }
                else {
                    callback(null, evts);
                }
            });
        },
        function (evts, callback) {
            logger.trace("replaying events...");
            var eventPayload = _.map(evts, "payload");
            cqrs_denormalizerService.replay(eventPayload, function (err) {
                if (err) {
                    callback.call(err);
                }
                else {
                    callback(null);
                }
            });
        }
    ];

    async.waterfall(tasks, function (err) {
        if (err) {
            logger.error("replaying failed: ", err);
        }
        else {
            logger.debug("replaying finished...");
        }

        if (callback !== undefined) {
            callback(err);
        }
    });
}

module.exports = {service: cqrs_denormalizerService, init: init, replay: replay};
