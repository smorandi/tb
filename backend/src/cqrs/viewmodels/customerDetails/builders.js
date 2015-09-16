var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");

var customerCreatedVB = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "customer",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerCreated (vm.repository.collectionName) -> " + vm.repository.collectionName);
    if(data.firstname !== undefined) {
        vm.set("firstname", data.firstname);
    }
    if(data.lastname !== undefined) {
        vm.set("lastname", data.lastname);
    }
});

var customerChangedVB = denormalizer.defineViewBuilder({
    name: "customerChanged",
    aggregate: "customer",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerChanged (vm.repository.collectionName) -> " + vm.repository.collectionName);
    if(data.firstname !== undefined) {
        vm.set("firstname", data.firstname);
    }
    if(data.lastname !== undefined) {
        vm.set("lastname", data.lastname);
    }
});

var customerDeletedVB = denormalizer.defineViewBuilder({
    name: "customerDeleted",
    aggregate: "customer",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerDeleted (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.destroy();
});

module.exports = [customerCreatedVB, customerChangedVB, customerDeletedVB];