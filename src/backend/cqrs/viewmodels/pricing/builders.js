var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../utils/logger");
var pricingService = require("../../../services/pricing.service.js");

var i = 0;


var drinkCreated = denormalizer.defineViewBuilder({
    name: "drinkCreated",
    aggregate: "drink",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("drinkCreated in collection: " + vm.repository.collectionName);

    vm.set("id", vm.id);
    vm.set("name", data.name);
    vm.set("price", data.priceTicks[0].price);
    vm.set("basePrice", data.basePrice);
    vm.set("priceStep", data.priceStep);
    vm.set("minPrice", data.minPrice);
    vm.set("maxPrice", data.maxPrice);
    vm.set("priceReductionTimeBase", data.creationDate);
});

var drinkChanged = denormalizer.defineViewBuilder({
    name: "drinkChanged",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("drinkChanged in collection: " + vm.repository.collectionName);

    vm.set("id", vm.id);
    vm.set("name", data.name);
    vm.set("price", vm.get("price"));
    vm.set("priceReductionTimeBase", data.modificationDate);
});

var drinkDeleted = denormalizer.defineViewBuilder({
    name: "drinkDeleted",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("drinkDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var priceChanged = denormalizer.defineViewBuilder({
    name: "priceChanged",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (priceTick, vm) {
    logger.debug("priceChanged in collection: " + vm.repository.collectionName);
    vm.set("price", priceTick.price);
    vm.set("priceReductionTimeBase", priceTick.timestamp);
});

var priceReset = denormalizer.defineViewBuilder({
    name: "priceReset",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (priceTick, vm) {
    logger.debug("priceReset in collection: " + vm.repository.collectionName);
    vm.set("price", priceTick.price);
});

var orderConfirmed = denormalizer.defineViewBuilder({
    name: "orderConfirmed",
    aggregate: "user",
    query: {},
}, function (order, vm) {
    logger.debug("orderConfirmed in collection: " + vm.repository.collectionName);

    var drinkId = vm.get("id");
    if (pricingService.orderContainsDrinkId(order, drinkId)) {
        vm.set("lastOrderTimestamp", order.timestamp);
        vm.set("priceReductionTimeBase", order.timestamp);
    }
});

var engineStarted = denormalizer.defineViewBuilder({
    name: "engineStarted",
    aggregate: "engine",
    query: {},
}, function (engine, vm) {
    logger.debug("engineStarted in collection: " + vm.repository.collectionName);
    vm.set("priceReductionTimeBase", engine.event.timestamp);
});

var engineStopped = denormalizer.defineViewBuilder({
    name: "engineStopped",
    aggregate: "engine",
    query: {},
}, function (engine, vm) {
    logger.debug("engineStopped in collection: " + vm.repository.collectionName);
    vm.set("priceReductionTimeBase", null);
});

var priceTickRequested = denormalizer.defineViewBuilder({
    name: "priceTickRequested",
    aggregate: "engine",
    query: {},
}, function (engine, vm) {
    logger.debug("priceTickRequested in collection: " + vm.repository.collectionName);
});

module.exports = [drinkCreated, drinkChanged, drinkDeleted, priceChanged, priceReset, orderConfirmed, engineStarted, engineStopped];