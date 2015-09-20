var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");
var pricingService = require("../../pricing.service");

var drinkCreated = denormalizer.defineViewBuilder({
    name: "drinkCreated",
    aggregate: "drink",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("drinkCreated in collection: " + vm.repository.collectionName);
    vm.set("id", vm.id);
    vm.set("name", data.name);
    vm.set("category", data.category);
    vm.set("tags", data.tags);
    vm.set("quantity", data.quantity);
    vm.set("price", data.priceTicks[0].price);
    vm.set("basePrice", data.basePrice);
    vm.set("priceStep", data.priceStep);
    vm.set("minPrice", data.minPrice);
    vm.set("maxPrice", data.maxPrice);
    vm.set("priceReductionTimeBase", null);
});

var drinkChanged = denormalizer.defineViewBuilder({
    name: "drinkChanged",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("drinkChanged in collection: " + vm.repository.collectionName);
    vm.set("name", data.name);
    vm.set("category", data.category);
    vm.set("tags", data.tags);
    vm.set("quantity", data.quantity);
    vm.set("minPrice", data.minPrice);
    vm.set("maxPrice", data.maxPrice);
    vm.set("basePrice", data.basePrice);
    vm.set("priceStep", data.priceStep);
});

var drinkDeleted = denormalizer.defineViewBuilder({
    name: "drinkDeleted",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("drinkDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var priceChanged = denormalizer.defineViewBuilder({
    name: "priceChanged",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (priceTick, vm) {
    logger.info("priceChanged in collection: " + vm.repository.collectionName);
    vm.set("price", priceTick.price);
});

var orderConfirmed = denormalizer.defineViewBuilder({
    name: "orderConfirmed",
    aggregate: "user",
    query: {},
}, function (order, vm) {
    logger.info("orderConfirmed in collection: " + vm.repository.collectionName);

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
    logger.info("engineStarted in collection: " + vm.repository.collectionName);
    vm.set("priceReductionTimeBase", engine.event.timestamp);
});

var engineStopped = denormalizer.defineViewBuilder({
    name: "engineStopped",
    aggregate: "engine",
    query: {},
}, function (engine, vm) {
    logger.info("engineStopped in collection: " + vm.repository.collectionName);
    vm.set("priceReductionTimeBase", null);
});

module.exports = [drinkCreated, drinkChanged, drinkDeleted, priceChanged, orderConfirmed, engineStarted, engineStopped];