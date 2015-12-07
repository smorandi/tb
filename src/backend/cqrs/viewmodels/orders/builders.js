var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var async = require("async");
var logger = require("../../../utils/logger");
var drinkCollection = require("../drinks/collection");

var customerCreated = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("customerCreated in collection: " + vm.repository.collectionName);
    vm.set("orders", []);
});

var customerDeleted = denormalizer.defineViewBuilder({
    name: "customerDeleted",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false
}, function (data, vm) {
    logger.debug("customerDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var orderCreated = denormalizer.defineViewBuilder({
    name: "orderCreated",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false
}, function (order, vm) {
    logger.debug("orderCreated in collection: " + vm.repository.collectionName);

    vm.get("orders").push(order);
});

var orderConfirmed = denormalizer.defineViewBuilder({
    name: "orderConfirmed",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false
}, function (enrichedOrder, vm) {
    logger.debug("orderConfirmed in collection: " + vm.repository.collectionName);

    _.remove(vm.get("orders"), "id", enrichedOrder.id);
    vm.get("orders").push(enrichedOrder);
});


module.exports = [customerCreated, customerDeleted, orderCreated, orderConfirmed];