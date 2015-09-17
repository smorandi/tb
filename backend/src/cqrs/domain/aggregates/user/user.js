"use strict";

var _ = require("lodash");
var domain = require("cqrs-domain");
var uuid = require("node-uuid");
var validationService = require("../../../validation.service");

var user = domain.defineAggregate({
        name: "user",
        defaultCommandPayload: "payload",
        defaultEventPayload: "payload",
        defaultPreConditionPayload: "payload"
    },
    {
        firstname: "firstname",
        lastname: "lastname",
        loginname: "loginname",
        password: "password",
    });

// ----------------------------------------------------------------
// create customer
// ----------------------------------------------------------------
var createCustomerCmd = domain.defineCommand({
    name: "createCustomer",
    existing: false,
}, function (data, aggregate) {
    _.defaults(data, aggregate.attributes);
    data.type = "customer";
    data.basket = [];
    data.orders = [];

    aggregate.apply("customerCreated", data);
});

var customerCreatedEvt = domain.defineEvent({
        name: "customerCreated"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// create admin
// ----------------------------------------------------------------
var createAdminCmd = domain.defineCommand({
    name: "createAdmin",
    existing: false,
}, function (data, aggregate) {
    _.defaults(data, aggregate.attributes);
    data.type = "admin";

    aggregate.apply("adminCreated", data);
});

var adminCreatedEvt = domain.defineEvent({
        name: "adminCreated"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


// ----------------------------------------------------------------
// change
// ----------------------------------------------------------------
var changeUserCmd = domain.defineCommand({
    name: "changeUser",
    existing: true,
}, function (data, aggregate) {
    aggregate.apply("userChanged", data);
});

var userChangedEvt = domain.defineEvent({
        name: "userChanged"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// delete
// ----------------------------------------------------------------
var deleteUserCmd = domain.defineCommand({
    name: "deleteUser",
}, function (data, aggregate) {
    aggregate.apply("userDeleted", data);
});

var userDeletedEvt = domain.defineEvent({
        name: "userDeleted"
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
        aggregate.get("basket").push(basketItem);
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
        _.remove(aggregate.get("basket"), function (item) {
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
    var basket = aggregate.get("basket");

    var orderItems = [];
    basket.forEach(function (basketItem) {
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
        aggregate.set("basket", []);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

var createUserPrecondition_mandatoryAttributesSet = domain.definePreCondition({
    name: ["createAdmin", "createCustomer"],
    description: "mandatory attributes must be set",
}, function (data, aggregate) {
    if (!data.loginname) {
        throw new Error();
    }
    if (!data.password) {
        throw new Error();
    }
});

var createUserPrecondition_uniqueLoginName = domain.definePreCondition({
    name: ["createAdmin", "createCustomer"],
    description: "loginname already exists",
}, function (data, aggregate) {
    validationService.isUniqueLoginName(data.loginname, function (err, isUnique) {
        if (err) {
            throw err;
        }
        else if (!isUnique) {
            throw new Error();
        }
        else {
            // all ok, loginname is unique...
        }
    });
});

var changeUserPrecondition_allowedChanges = domain.definePreCondition({
    name: "changeUser",
    description: "change is not allowed",
}, function (data, aggregate) {
    //only firstname, lastname, loginname and password can be changed!!!
    // --> check here...
});

var makeOrderPrecondition_basketNotEmpty = domain.definePreCondition({
    name: "makeOrder",
    description: "basket must not be empty",
}, function (data, aggregate) {
    if (aggregate.get("basket").length === 0) {
        throw new Error();
    }
});


module.exports = [user,
    createCustomerCmd, customerCreatedEvt,
    createAdminCmd, adminCreatedEvt,
    changeUserCmd, userChangedEvt,
    deleteUserCmd, userDeletedEvt,
    addBasketItemCmd, basketItemAddedEvt,
    removeBasketItemCmd, basketItemRemovedEvt,
    makeOrderCmd, orderMadeEvt,
    // preconditions
    createUserPrecondition_mandatoryAttributesSet,
    createUserPrecondition_uniqueLoginName,
    changeUserPrecondition_allowedChanges,
    makeOrderPrecondition_basketNotEmpty];