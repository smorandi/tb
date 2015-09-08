"use strict";

var _ = require("lodash");
var domain = require("cqrs-domain");
var uuid = require("node-uuid");

var customer = domain.defineAggregate({
        name: "customer",
        defaultCommandPayload: "payload",
        defaultEventPayload: "payload",
        defaultPreConditionPayload: "payload"
    },
    {
        firstname: "firstname",
        lastname: "lastname",
        basketItems: [],
        orders: [],
    });

// ----------------------------------------------------------------
// create
// ----------------------------------------------------------------
var createCustomerCmd = domain.defineCommand({
    name: "createCustomer",
    existing: false,
}, function (data, aggregate) {
    aggregate.apply("customerCreated", _.defaults(data, aggregate.attributes));
});

var customerCreatedEvt = domain.defineEvent({
        name: "customerCreated"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


// ----------------------------------------------------------------
// change
// ----------------------------------------------------------------
var changeCustomerCmd = domain.defineCommand({
    name: "changeCustomer",
    revision: "payload._revision",
    existing: true,
}, function (data, aggregate) {
    aggregate.apply("customerChanged", data);
});

var customerChangedEvt = domain.defineEvent({
        name: "customerChanged"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// delete
// ----------------------------------------------------------------
var deleteCustomerCmd = domain.defineCommand({
    name: "deleteCustomer",
}, function (data, aggregate) {
    aggregate.apply("customerDeleted", data);
});

var customerDeletedEvt = domain.defineEvent({
        name: "customerDeleted"
    },
    function (data, aggregate) {
        aggregate.destroy();
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// add item to basket
// ----------------------------------------------------------------
var addBasketItemCmd = domain.defineCommand({
    name: "addBasketItem",
    existing: true,
}, function (data, aggregate) {
    var basketItem = {id: uuid.v4().toString(), item: {id: data.drinkId}, number: data.number};
    aggregate.apply("basketItemAdded", basketItem);
});

var basketItemAddedEvt = domain.defineEvent({
        name: "basketItemAdded"
    },
    function (basketItem, aggregate) {
        aggregate.get("basketItems").push(basketItem);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// remove item from basket
// ----------------------------------------------------------------
var removeBasketItemCmd = domain.defineCommand({
    name: "removeBasketItem",
    existing: true,
}, function (id, aggregate) {
    aggregate.apply("basketItemRemoved", id);
});

var basketItemRemovedEvt = domain.defineEvent({
        name: "basketItemRemoved"
    },
    function (id, aggregate) {
        _.remove(aggregate.get("basketItems"), function (item) {
            return item.id === id;
        });
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// make order
// ----------------------------------------------------------------
var makeOrderCmd = domain.defineCommand({
    name: "makeOrder",
    exists: true
}, function (data, aggregate) {

    var id = uuid.v4().toString();
    var timestamp = new Date();
    var basketItems = aggregate.get("basketItems");

    var orderItems = [];
    basketItems.forEach(function (basketItem) {
        orderItems.push({item: {id: basketItem.item.id}, number: basketItem.number});
    });

    // ==========================================================================
    // ========>> here we need to fetch the current price for the order !!!!!!!!!
    // ==========================================================================

    var order = {id: id, timestamp: timestamp, orderItems: orderItems};
    aggregate.apply("orderMade", order);
});

var orderMadeEvt = domain.defineEvent({
        name: "orderMade"
    },
    function (order, aggregate) {
        aggregate.get("orders").push(order);

        // clear the basket...
        aggregate.set("basketItems", []);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


var makeOrderPrecondition = domain.definePreCondition({
    name: "makeOrder",
    description: "basket must not be empty",
}, function (data, aggregate) {
    if (aggregate.get("basketItems").length === 0) {
        throw new Error();
    }
});


module.exports = [customer,
    createCustomerCmd, customerCreatedEvt,
    changeCustomerCmd, customerChangedEvt,
    deleteCustomerCmd, customerDeletedEvt,
    addBasketItemCmd, basketItemAddedEvt,
    removeBasketItemCmd, basketItemRemovedEvt,
    makeOrderCmd, orderMadeEvt, makeOrderPrecondition];