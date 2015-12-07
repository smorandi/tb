"use strict";

var _ = require("lodash");
var domain = require("cqrs-domain");
var models = require("../../../../core/models");
var config = require("../../../../config");

var engine = domain.defineAggregate({
        name: "engine",
        defaultCommandPayload: "payload",
        defaultEventPayload: "payload",
        defaultPreConditionPayload: "payload"
    },
    {
        status: "idle",
        priceReductionInterval: config.defaults.priceReductionInterval || 5000,
        priceReductionGracePeriod: config.defaults.priceReductionGracePeriod || 10000
    });

var createEngine = domain.defineCommand({
    name: "createEngine"
}, function (data, aggregate) {
    var data = _.cloneDeep(aggregate.attributes);
    data.status = "idle";
    data.event = new models.Event("engineCreated");
    aggregate.apply("engineCreated", data);
});

var engineCreated = domain.defineEvent({
        name: "engineCreated"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

var startEngine = domain.defineCommand({
    name: "startEngine",
    existing: true
}, function (data, aggregate) {
    var data = _.cloneDeep(aggregate.attributes);
    data.status = "running";
    data.event = new models.Event("engineStarted");
    aggregate.apply("engineStarted", data);
});

var engineStarted = domain.defineEvent({
        name: "engineStarted"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

var stopEngine = domain.defineCommand({
    name: "stopEngine",
    existing: true
}, function (data, aggregate) {
    var data = _.cloneDeep(aggregate.attributes);
    data.status = "idle";
    data.event = new models.Event("engineStopped");
    aggregate.apply("engineStopped", data);
});

var engineStopped = domain.defineEvent({
        name: "engineStopped"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

var changePriceReductionInterval = domain.defineCommand({
    name: "changePriceReductionInterval",
    existing: true
}, function (data, aggregate) {
    data.event = new models.Event("priceReductionIntervalChanged");
    aggregate.apply("priceReductionIntervalChanged", data);
});

var priceReductionIntervalChanged = domain.defineEvent({
        name: "priceReductionIntervalChanged"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

var changePriceReductionGracePeriod = domain.defineCommand({
    name: "changePriceReductionGracePeriod",
    existing: true
}, function (data, aggregate) {
    data.event = new models.Event("priceReductionGracePeriodChanged");
    aggregate.apply("priceReductionGracePeriodChanged", data);
});

var priceReductionGracePeriodChanged = domain.defineEvent({
        name: "priceReductionGracePeriodChanged"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

var requestPriceTick = domain.defineCommand({
    name: "requestPriceTick",
    existing: true
}, function (data, aggregate) {
    data.event = new models.Event("priceTickRequest");
    aggregate.apply("priceTickRequested", data);
});

var priceTickRequested = domain.defineEvent({
        name: "priceTickRequested"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

module.exports = [engine,
    createEngine, engineCreated,
    changePriceReductionInterval, priceReductionIntervalChanged,
    changePriceReductionGracePeriod, priceReductionGracePeriodChanged,
    startEngine, engineStarted,
    stopEngine, engineStopped,
    requestPriceTick, priceTickRequested];