var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../utils/logger");
var dashboardCollection = require("../dashboard/collection");

var customerCreated = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("customerCreated in collection: " + vm.repository.collectionName);
    vm.set("basket", []);
});

var userDeleted = denormalizer.defineViewBuilder({
    name: "userDeleted",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("userDeleted deleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var basketItemAdded = denormalizer.defineViewBuilder({
    name: "basketItemAdded",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (basketItem, vm, callback) {
    logger.debug("basketItemAdded in collection: " + vm.repository.collectionName, basketItem);

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

var basketItemRemoved = denormalizer.defineViewBuilder({
    name: "basketItemRemoved",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (id, vm) {
    logger.debug("basketItemRemoved in collection: " + vm.repository.collectionName, id);

    _.remove(vm.get("basket"), "id", id);
});

var basketItemChanged = denormalizer.defineViewBuilder({
    name: "basketItemChanged",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (basketItem, vm, callback) {
    logger.debug("basketItemChanged in collection: " + vm.repository.collectionName);
    var basket = vm.get("basket");
    dashboardCollection.loadViewModel(basketItem.item.id, function (err, doc) {
        if (err) {
            callback(err);
        } else {
            basketItem.item = doc.toJSON();
            var index = _.findIndex(basket, "id", basketItem.id);
            if (index === -1) {
                callback(new Error("cannot change basketItem - index not found"));
            }
            else {
                basket.splice(index, 1, basketItem);
                callback(null);
            }
        }
    });
});

var orderCreated = denormalizer.defineViewBuilder({
    name: "orderCreated",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (order, vm) {
    logger.debug("orderCreated in collection: " + vm.repository.collectionName, order);

    // clear basket...
    vm.set("basket", []);
});


module.exports = [customerCreated, userDeleted, basketItemAdded, basketItemChanged, basketItemRemoved, orderCreated];