var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");

var customerCreated = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("customerCreated in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var customerChanged = denormalizer.defineViewBuilder({
    name: "userChanged",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("customerChanged in collection: " + vm.repository.collectionName);
    vm.set(data);
});

var customerDeleted = denormalizer.defineViewBuilder({
    name: "userDeleted",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("customerDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var basketItemAdded = denormalizer.defineViewBuilder({
    name: "basketItemAdded",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (basketItem, vm) {
    logger.debug("basketItemAdded in collection: " + vm.repository.collectionName, basketItem);

    var drinkCollection = require("../drinks/collection");
    drinkCollection.loadViewModel(basketItem.item.id, function (err, vm) {
        if (err) {
            logger.error("Error: ", err);
        } else {
            basketItem.item = vm.toJSON();
        }
    });

    vm.get("basket").push(basketItem);
});

var basketItemRemoved = denormalizer.defineViewBuilder({
    name: "basketItemRemoved",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (id, vm) {
    logger.debug("basketItemRemoved in collection: " + vm.repository.collectionName, id);

    _.remove(vm.get("basket"), "id", id);
});

var orderMade = denormalizer.defineViewBuilder({
    name: "orderCreated",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (order, vm) {
    logger.debug("orderMade in collection: " + vm.repository.collectionName);

    var drinkCollection = require("../drinks/collection");

    order.orderItems.forEach(function (orderItem) {
        drinkCollection.loadViewModel(orderItem.item.id, function (err, vm) {
            if (err) {
                logger.error("Error: ", err);
            } else {
                orderItem.item = vm.toJSON();
            }
        });
    });

    vm.get("orders").push(order);
    vm.set("basket", []);
});

var orderConfirmed = denormalizer.defineViewBuilder({
    name: "orderConfirmed",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (enrichedOrder, vm) {
    logger.debug("orderMade in collection: " + vm.repository.collectionName);

    var drinkCollection = require("../drinks/collection");

    enrichedOrder.orderItems.forEach(function (orderItem) {
        drinkCollection.loadViewModel(orderItem.item.id, function (err, vm) {
            if (err) {
                logger.error("Error: ", err);
            } else {
                orderItem.item = vm.toJSON();
            }
        });
    });

    _.remove(vm.get("orders"), "id", enrichedOrder.id);

    vm.get("orders").push(enrichedOrder);
});



module.exports = [customerCreated, customerChanged, customerDeleted, basketItemAdded, basketItemRemoved, orderMade, orderConfirmed];