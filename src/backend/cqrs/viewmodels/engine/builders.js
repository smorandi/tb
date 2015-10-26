var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../utils/logger");
var _ = require("lodash");

var engineCreated = denormalizer.defineViewBuilder({
    name: "engineCreated",
    aggregate: "engine",
    id: "aggregate.id",
}, function (data, vm) {
    logger.debug("engineCreated in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.set("events", [data.event]);
});

var engineStarted = denormalizer.defineViewBuilder({
    name: "engineStarted",
    aggregate: "engine",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("engineStarted in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.get("events").unshift(data.event);
});

var engineStopped = denormalizer.defineViewBuilder({
    name: "engineStopped",
    aggregate: "engine",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("engineStopped in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.get("events").unshift(data.event);
});

var priceReductionIntervalChanged = denormalizer.defineViewBuilder({
    name: "priceReductionIntervalChanged",
    aggregate: "engine",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("priceReductionIntervalChanged in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.get("events").unshift(data.event);
});

var priceReductionGracePeriodChanged = denormalizer.defineViewBuilder({
    name: "priceReductionGracePeriodChanged",
    aggregate: "engine",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("priceReductionGracePeriodChanged in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.get("events").unshift(data.event);
});

module.exports = [priceReductionIntervalChanged, priceReductionGracePeriodChanged, engineStarted, engineStopped, engineCreated];