var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");

var customerCreatedVB = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerCreated in collection: " + vm.repository.collectionName);
    vm.set("basket", []);
});

var userDeletedVB = denormalizer.defineViewBuilder({
    name: "userDeleted",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("userDeleted deleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var basketItemAddedVB = denormalizer.defineViewBuilder({
    name: "basketItemAdded",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (basketItem, vm) {
    logger.info("basketItemAdded in collection: " + vm.repository.collectionName, basketItem);

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

var basketItemRemovedVB = denormalizer.defineViewBuilder({
    name: "basketItemRemoved",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (id, vm) {
    logger.info("basketItemRemoved in collection: " + vm.repository.collectionName, id);

    _.remove(vm.get(), function (item) {
        return item.id === id;
    });
});

var orderMadeVB = denormalizer.defineViewBuilder({
    name: "orderMade",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (order, vm) {
    logger.info("orderMade in collection: " + vm.repository.collectionName, order);

    // clear basket...
    vm.set("basket", []);
});


module.exports = [customerCreatedVB, userDeletedVB, basketItemAddedVB, basketItemRemovedVB, orderMadeVB];