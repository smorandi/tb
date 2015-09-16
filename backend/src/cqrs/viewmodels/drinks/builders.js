var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");

var drinkChangedVB = denormalizer.defineViewBuilder({
    name: "drinkChanged",
    aggregate: "drink",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("drinkChanged (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.set(data);
});

var drinkCreatedVB = denormalizer.defineViewBuilder({
    name: "drinkCreated",
    aggregate: "drink",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("drinkCreated (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.set(data);
});

var drinkDeletedVB = denormalizer.defineViewBuilder({
    name: "drinkDeleted",
    aggregate: "drink",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("drinkDeleted (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.destroy();
});

module.exports = [drinkCreatedVB, drinkChangedVB, drinkDeletedVB];