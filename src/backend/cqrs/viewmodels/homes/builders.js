var _ = require("lodash");
var denormalizer = require("cqrs-eventdenormalizer");
var logger = require("../../../utils/logger");

var adminCreated = denormalizer.defineViewBuilder({
    name: "adminCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("adminCreated in collection: " + vm.repository.collectionName);
    vm.set("loginname", data.loginname);
    vm.set("userType", data.type);
    vm.set("numberOfBasketItems", 0);
});

var rootCreated = denormalizer.defineViewBuilder({
    name: "rootCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("rootCreated in collection: " + vm.repository.collectionName);
    vm.set("loginname", data.loginname);
    vm.set("userType", data.type);
    vm.set("numberOfBasketItems", 0);
});

var customerCreated = denormalizer.defineViewBuilder({
    name: "customerCreated",
    aggregate: "user",
    id: "aggregate.id"
}, function (data, vm) {
    logger.debug("customerCreated in collection: " + vm.repository.collectionName);
    vm.set("loginname", data.loginname)
    vm.set("userType", data.type);
    vm.set("numberOfBasketItems", 0);
});

var userChanged = denormalizer.defineViewBuilder({
    name: "userChanged",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("userChanged in collection: " + vm.repository.collectionName);
    vm.set("loginname", data.loginname);
});

var userDeleted = denormalizer.defineViewBuilder({
    name: "userDeleted",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (data, vm) {
    logger.debug("userDeleted in collection: " + vm.repository.collectionName);
    vm.destroy();
});

var basketItemAdded = denormalizer.defineViewBuilder({
    name: "basketItemAdded",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (basketItem, vm) {
    logger.debug("basketItemAdded in collection: " + vm.repository.collectionName, basketItem);
    vm.set("numberOfBasketItems", vm.get("numberOfBasketItems") + 1);
});

var basketItemRemoved = denormalizer.defineViewBuilder({
    name: "basketItemRemoved",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (id, vm) {
    logger.debug("basketItemRemoved in collection: " + vm.repository.collectionName, id);
    vm.set("numberOfBasketItems", vm.get("numberOfBasketItems") - 1);
});

var orderMade = denormalizer.defineViewBuilder({
    name: "orderMade",
    aggregate: "user",
    id: "aggregate.id",
    autoCreate: false,
}, function (order, vm) {
    logger.debug("orderMade in collection: " + vm.repository.collectionName, order);
    vm.set("numberOfBasketItems", 0);
});

module.exports = [adminCreated, customerCreated, rootCreated, userChanged, userDeleted, basketItemAdded, basketItemRemoved, orderMade];