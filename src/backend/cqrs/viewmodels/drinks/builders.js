var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../utils/logger");

var drinkCreated = denormalizer.defineViewBuilder({
    name: "drinkCreated",
    aggregate: "drink",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("drinkCreated in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var drinkChanged = denormalizer.defineViewBuilder({
    name: "drinkChanged",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false
}, function (data, vm) {
    logger.debug("drinkChanged in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var drinkDeleted = denormalizer.defineViewBuilder({
    name: "drinkDeleted",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false
}, function (data, vm) {
    logger.debug("drinkDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var priceChanged = denormalizer.defineViewBuilder({
    name: "priceChanged",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false
}, function (priceTick, vm) {
    logger.debug("priceChanged in collection: " + vm.repository.collectionName);
    vm.get("priceTicks").unshift(priceTick);
});

var priceReset = denormalizer.defineViewBuilder({
    name: "priceReset",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false
}, function (priceTick, vm) {
    logger.debug("priceReset in collection: " + vm.repository.collectionName);
    vm.get("priceTicks").unshift(priceTick);
});


module.exports = [drinkCreated, drinkChanged, drinkDeleted, priceChanged, priceReset];