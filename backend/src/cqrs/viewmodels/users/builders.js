var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");

var adminCreatedVB = denormalizer.defineViewBuilder({
    name: "adminCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("adminCreated in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var customerCreatedVB = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerCreated in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var userChangedVB = denormalizer.defineViewBuilder({
    name: "userChanged",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("userChanged in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var userDeletedVB = denormalizer.defineViewBuilder({
    name: "userDeleted",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("userDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

module.exports = [adminCreatedVB, customerCreatedVB, userChangedVB, userDeletedVB];