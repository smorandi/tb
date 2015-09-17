var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");

var drinkCreatedVB = denormalizer.defineViewBuilder({
    name: "drinkCreated",
    aggregate: "drink",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("drinkCreated in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var drinkChangedVB = denormalizer.defineViewBuilder({
    name: "drinkChanged",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("drinkChanged in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var drinkDeletedVB = denormalizer.defineViewBuilder({
    name: "drinkDeleted",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("drinkDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

module.exports = [drinkCreatedVB, drinkChangedVB, drinkDeletedVB];