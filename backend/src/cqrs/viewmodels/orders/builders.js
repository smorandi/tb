var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");

var customerCreatedVB = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "customer",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerCreated (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.set("orders", []);
});

var customerDeletedVB = denormalizer.defineViewBuilder({
    name: "customerDeleted",
    aggregate: "customer",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerDeleted (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.destroy();
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
});


module.exports = [customerCreatedVB, customerDeletedVB, orderMadeVB];