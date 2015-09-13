var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../config/logger");

var customerCreatedVB = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "customer",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerCreated (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.set(data);
});

var customerChangedVB = denormalizer.defineViewBuilder({
    name: "customerChanged",
    aggregate: "customer",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerChanged (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.set(data);
});

var customerDeletedVB = denormalizer.defineViewBuilder({
    name: "customerDeleted",
    aggregate: "customer",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerDeleted (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.destroy();
});

var basketItemAddedVB = denormalizer.defineViewBuilder({
    name: "basketItemAdded",
    aggregate: "customer",
    id: "aggregate.id"
}, function (basketItem, vm) {
    logger.info("basketItemAdded (vm.repository.collectionName) -> " + vm.repository.collectionName, basketItem);

    var drinkCollection = require("../drinks/collection");
    drinkCollection.loadViewModel(basketItem.item.id, function (err, vm) {
        if (err) {
            logger.error("Error: ", err);
        } else {
            basketItem.item = vm.toJSON();
        }
    });

    vm.get("basketItems").push(basketItem);
});

var basketItemRemovedVB = denormalizer.defineViewBuilder({
    name: "basketItemRemoved",
    aggregate: "customer",
    id: "aggregate.id"
}, function (id, vm) {
    logger.info("basketItemRemoved (vm.repository.collectionName) -> " + vm.repository.collectionName, id);

    _.remove(vm.get("basketItems"), function (item) {
        return item.id === id;
    });
});

var orderMadeVB = denormalizer.defineViewBuilder({
    name: "orderMade",
    aggregate: "customer",
    id: "aggregate.id"
}, function (order, vm) {
    logger.info("orderMadeVB (vm.repository.collectionName) -> " + vm.repository.collectionName);

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

    // clear basket...
    vm.set("basketItems", []);
});


module.exports = [customerCreatedVB, customerChangedVB, customerDeletedVB, basketItemAddedVB, basketItemRemovedVB, orderMadeVB];