var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");

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
    vm.set("tick", data.priceTicks[0]);
    vm.set("price", data.priceTicks[0].price);
    vm.set("lowestPrice", null);
    vm.set("highestPrice", null);
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

    var lowestPrice = vm.get("lowestPrice");
    var highestPrice = vm.get("highestPrice");

    var newPrice = priceTick.price;
    var lowestPrice = lowestPrice ? Math.min(lowestPrice, newPrice) : newPrice;
    var highestPrice = highestPrice ? Math.max(highestPrice, newPrice) : newPrice;

    vm.set("lowestPrice", lowestPrice);
    vm.set("highestPrice", highestPrice);
    vm.set("tick", priceTick);
    vm.set("price", newPrice);
});

module.exports = [drinkCreated, drinkChanged, drinkDeleted, priceChanged];