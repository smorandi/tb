var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");
var _ = require("lodash");

var engineStarted = denormalizer.defineViewBuilder({
    name: "engineStarted",
    aggregate: "engine",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("drinkChanged in collection: " + vm.repository.collectionName);
    vm.set(data);

    vm.set("events", [].concat(vm.get("events")))
    vm.get("events").unshift(data.event);
});

var engineStopped = denormalizer.defineViewBuilder({
    name: "engineStopped",
    aggregate: "engine",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("drinkDeleted in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.set("events", [].concat(vm.get("events")))
    vm.get("events").unshift(data.event);
});

var recalculationIntervalChanged = denormalizer.defineViewBuilder({
    name: "recalculationIntervalChanged",
    aggregate: "engine",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("drinkDeleted in collection: " + vm.repository.collectionName);
    vm.set(data);
    vm.set("events", [].concat(vm.get("events")))
    vm.get("events").unshift(data.event);
});

module.exports = [recalculationIntervalChanged, engineStarted, engineStopped];