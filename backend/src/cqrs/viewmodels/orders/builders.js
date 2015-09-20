var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");

var customerCreatedVB = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerCreated in collection: " + vm.repository.collectionName);
    vm.set("orders", []);
});

var customerDeletedVB = denormalizer.defineViewBuilder({
    name: "customerDeleted",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("customerDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var orderMadeVB = denormalizer.defineViewBuilder({
    name: "orderCreated",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (order, vm) {
    logger.info("orderMade in collection: " + vm.repository.collectionName);

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
});

var orderConfirmedVB = denormalizer.defineViewBuilder({
    name: "orderConfirmed",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (enrichedOrder, vm) {
    logger.info("orderConfirmed in collection: " + vm.repository.collectionName);

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

    _.remove(vm.get("orders"), function (pendingOrder) {
        return pendingOrder.id === enrichedOrder.id;
    });
    vm.get("orders").push(enrichedOrder);
});


module.exports = [customerCreatedVB, customerDeletedVB, orderMadeVB, orderConfirmedVB];