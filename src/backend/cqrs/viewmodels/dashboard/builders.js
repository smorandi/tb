var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../utils/logger");

var drinkCreated = denormalizer.defineViewBuilder({
    name: "drinkCreated",
    aggregate: "drink",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("drinkCreated in collection: " + vm.repository.collectionName);

    vm.set("id", vm.id);
    vm.set("name", data.name);
    vm.set("description", data.description);
    vm.set("imageUrl", data.imageUrl);
    vm.set("category", data.category);
    vm.set("tags", data.tags);
    vm.set("quantity", data.quantity);
    vm.set("quantityUnit", data.quantityUnit);
    vm.set("tick", data.priceTicks[0]);
    vm.set("price", data.priceTicks[0].price);
    vm.set("lowestPrice", data.priceTicks[0].price);
    vm.set("highestPrice", data.priceTicks[0].price);
    vm.set("allTimeHigh", data.priceTicks[0].price);
    vm.set("allTimeLow", data.priceTicks[0].price);
});

var drinkChanged = denormalizer.defineViewBuilder({
    name: "drinkChanged",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("drinkChanged in collection: " + vm.repository.collectionName);

    vm.set("name", data.name);
    vm.set("description", data.description);
    vm.set("imageUrl", data.imageUrl);
    vm.set("category", data.category);
    vm.set("tags", data.tags);
    vm.set("quantity", data.quantity);
    vm.set("quantityUnit", data.quantityUnit);
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

    vm.set("tick", priceTick);
    var newPrice = priceTick.price;
    vm.set("price", newPrice);

    var lowestPrice = vm.get("lowestPrice");
    var highestPrice = vm.get("highestPrice");

    var newLowestPrice = lowestPrice ? Math.min(lowestPrice, newPrice) : newPrice;
    var newHighestPrice = highestPrice ? Math.max(highestPrice, newPrice) : newPrice;

    vm.set("lowestPrice", newLowestPrice);
    vm.set("highestPrice", newHighestPrice);


    var allTimeLow = vm.get("allTimeLow");
    var allTimeHigh = vm.get("allTimeHigh");

    var newAllTimeLow = allTimeLow ? Math.min(allTimeLow, newLowestPrice) : newLowestPrice;
    var newAllTimeHigh = allTimeHigh ? Math.max(allTimeHigh, newHighestPrice) : newHighestPrice;

    vm.set("allTimeLow", newAllTimeLow);
    vm.set("allTimeHigh", newAllTimeHigh);
});

var priceReset = denormalizer.defineViewBuilder({
    name: "priceReset",
    aggregate: "drink",
    id: "aggregate.id",
    autoCreate: false,
}, function (priceTick, vm) {
    logger.debug("priceReset in collection: " + vm.repository.collectionName);

    vm.set("tick", priceTick);
    var newPrice = priceTick.price;
    vm.set("price", newPrice);

    vm.set("lowestPrice", newPrice);
    vm.set("highestPrice", newPrice);

    var allTimeLow = vm.get("allTimeLow");
    var allTimeHigh = vm.get("allTimeHigh");

    var newAllTimeLow = allTimeLow ? Math.min(allTimeLow, newPrice) : newPrice;
    var newAllTimeHigh = allTimeHigh ? Math.max(allTimeHigh, newPrice) : newPrice;

    vm.set("allTimeLow", newAllTimeLow);
    vm.set("allTimeHigh", newAllTimeHigh);
});

module.exports = [drinkCreated, drinkChanged, drinkDeleted, priceChanged, priceReset];