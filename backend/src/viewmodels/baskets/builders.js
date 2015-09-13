var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../config/logger");

var customerCreatedVB = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "customer",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerCreated (vm.repository.collectionName) -> " + vm.repository.collectionName);
    vm.set("basketItems", []);
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

    _.remove(vm.get(), function (item) {
        return item.id === id;
    });
});

var orderMadeVB = denormalizer.defineViewBuilder({
    name: "orderMade",
    aggregate: "customer",
    id: "aggregate.id"
}, function (order, vm) {
    logger.info("orderMadeVB (vm.repository.collectionName) -> " + vm.repository.collectionName, order);

    // clear basket...
    vm.set("basketItems", []);
});


module.exports = [customerCreatedVB, customerDeletedVB, basketItemAddedVB, basketItemRemovedVB, orderMadeVB];