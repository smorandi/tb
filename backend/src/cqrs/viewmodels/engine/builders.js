var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");
var _ = require("lodash");

var engineCreated = denormalizer.defineViewBuilder({
    name: "engineCreated",
    aggregate: "engine",
    id: "aggregate.id",
}, function (data, vm) {
    logger.info("engineStarted in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.set("events", [data.event]);
});

var engineStarted = denormalizer.defineViewBuilder({
    name: "engineStarted",
    aggregate: "engine",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("engineStarted in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.get("events").unshift(data.event);
});

var engineStopped = denormalizer.defineViewBuilder({
    name: "engineStopped",
    aggregate: "engine",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("engineStopped in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.get("events").unshift(data.event);
});

var priceReductionIntervalChanged = denormalizer.defineViewBuilder({
    name: "priceReductionIntervalChanged",
    aggregate: "engine",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("priceReductionIntervalChanged in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.get("events").unshift(data.event);
});

module.exports = [priceReductionIntervalChanged, engineStarted, engineStopped, engineCreated];