var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var async = require("async");
var logger = require("../../../config/logger");
var drinkCollection = require("../drinks/collection");

var customerCreated = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.info("customerCreated in collection: " + vm.repository.collectionName);
    vm.set("orders", []);
});

var customerDeleted = denormalizer.defineViewBuilder({
    name: "customerDeleted",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.info("customerDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var orderCreated = denormalizer.defineViewBuilder({
    name: "orderCreated",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (order, vm) {
    logger.info("orderMade in collection: " + vm.repository.collectionName);

    //order.orderItems.forEach(function (orderItem) {
    //    drinkCollection.loadViewModel(orderItem.item.id, function (err, vm) {
    //        if (err) {
    //            logger.error("Error: ", err);
    //        } else {
    //            orderItem.item = vm.toJSON();
    //        }
    //    });
    //});

    vm.get("orders").push(order);
});

var orderConfirmed = denormalizer.defineViewBuilder({
    name: "orderConfirmed",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (enrichedOrder, vm) {
    logger.info("orderConfirmed in collection: " + vm.repository.collectionName);

    //var series = [];
    //enrichedOrder.orderItems.forEach(function (orderItem) {
    //    series.push(function (callback) {
    //        drinkCollection.loadViewModel(orderItem.item.id, function (err, doc) {
    //            if (err) {
    //                callback(err);
    //            } else {
    //                orderItem.item = doc.toJSON();
    //                callback(null);
    //            }
    //        });
    //    });
    //});
    //
    //async.series(series, function (err) {
    //    _.remove(vm.get("orders"), "id", enrichedOrder.id);
    //    vm.get("orders").push(enrichedOrder);
    //    callback(err);
    //});

    _.remove(vm.get("orders"), "id", enrichedOrder.id);
    vm.get("orders").push(enrichedOrder);
});


module.exports = [customerCreated, customerDeleted, orderCreated, orderConfirmed];