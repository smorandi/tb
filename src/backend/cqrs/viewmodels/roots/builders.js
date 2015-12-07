var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../utils/logger");

var rootCreated = denormalizer.defineViewBuilder({
    name: "rootCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("rootCreated in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var userChanged = denormalizer.defineViewBuilder({
    name: "userChanged",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false
}, function (data, vm) {
    logger.debug("userChanged in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var userDeleted = denormalizer.defineViewBuilder({
    name: "userDeleted",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false
}, function (data, vm) {
    logger.debug("userDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

module.exports = [rootCreated, userChanged, userDeleted];