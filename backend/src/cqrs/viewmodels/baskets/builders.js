var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../config/logger");
var dashboardCollection = require("../dashboard/collection");

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
}, function (basketItem, vm, callback) {
    logger.info("basketItemAdded in collection: " + vm.repository.collectionName, basketItem);

    dashboardCollection.loadViewModel(basketItem.item.id, function (err, doc) {
        if (err) {
            callback(err);
        } else {
            basketItem.item = doc.toJSON();
            vm.get("basket").push(basketItem);
            callback(null);
        }
    });

});

var basketItemRemovedVB = denormalizer.defineViewBuilder({
    name: "basketItemRemoved",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (id, vm) {
    logger.info("basketItemRemoved in collection: " + vm.repository.collectionName, id);

    _.remove(vm.get("basket"), "id", id);
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