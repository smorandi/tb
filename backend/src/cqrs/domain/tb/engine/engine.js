"use strict";

var _ = require("lodash");
var domain = require("cqrs-domain");
var models = require("../../../models/models");

var engine = domain.defineAggregate({
        name: "engine",
        defaultCommandPayload: "payload",
        defaultEventPayload: "payload",
        defaultPreConditionPayload: "payload"
    },
    {
        status: "idle",
        recalculationInterval: 5000,
    }).defineAggregateIdGenerator(function () {
        return "engine";
    });

var startEngine = domain.defineCommand({
    name: "startEngine",
}, function (data, aggregate) {
    var data = _.cloneDeep(aggregate.attributes);
    data.status = "started";
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

var changeRecalculationInterval = domain.defineCommand({
    name: "changeRecalculationInterval",
    existing: true,
}, function (data, aggregate) {
    data.event = new models.Event("recalculationIntervalChanged");
    aggregate.apply("recalculationIntervalChanged", data);
});

var recalculationIntervalChanged = domain.defineEvent({
        name: "recalculationIntervalChanged"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });


module.exports = [engine,
    changeRecalculationInterval, recalculationIntervalChanged,
    startEngine, engineStarted,
    stopEngine, engineStopped];