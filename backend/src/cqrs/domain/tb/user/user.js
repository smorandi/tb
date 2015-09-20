"use strict";

var _ = require("lodash");
var domain = require("cqrs-domain");
var uuid = require("node-uuid");
var validationService = require("../../../validation.service");
var models = require("../../../models/models");

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
var createCustomer = domain.defineCommand({
    name: "createCustomer",
    existing: false,
}, function (data, aggregate) {
    _.defaults(data, aggregate.attributes);
    data.type = "customer";
    data.basket = [];
    data.orders = [];

    aggregate.apply("customerCreated", data);
});

var customerCreated = domain.defineEvent({
        name: "customerCreated"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// create admin
// ----------------------------------------------------------------
var createAdmin = domain.defineCommand({
    name: "createAdmin",
    existing: false,
}, function (data, aggregate) {
    _.defaults(data, aggregate.attributes);
    data.type = "admin";

    aggregate.apply("adminCreated", data);
});

var adminCreated = domain.defineEvent({
        name: "adminCreated"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


// ----------------------------------------------------------------
// change
// ----------------------------------------------------------------
var changeUser = domain.defineCommand({
    name: "changeUser",
    existing: true,
}, function (data, aggregate) {
    aggregate.apply("userChanged", data);
});

var userChanged = domain.defineEvent({
        name: "userChanged"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// delete
// ----------------------------------------------------------------
var deleteUser = domain.defineCommand({
    name: "deleteUser",
}, function (data, aggregate) {
    aggregate.apply("userDeleted", data);
});

var userDeleted = domain.defineEvent({
        name: "userDeleted"
    },
    function (data, aggregate) {
        aggregate.destroy();
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// add item to basket
// ----------------------------------------------------------------
var addBasketItem = domain.defineCommand({
    name: "addBasketItem",
    existing: true,
}, function (data, aggregate) {
    var basketItem = new models.BasketItem(uuid.v4().toString(), {id: data.drinkId}, data.number);
    aggregate.apply("basketItemAdded", basketItem);
});

var basketItemAdded = domain.defineEvent({
        name: "basketItemAdded"
    },
    function (basketItem, aggregate) {
        aggregate.get("basket").push(basketItem);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// remove item from basket
// ----------------------------------------------------------------
var removeBasketItem = domain.defineCommand({
    name: "removeBasketItem",
    existing: true,
}, function (basketItemId, aggregate) {
    aggregate.apply("basketItemRemoved", basketItemId);
});

var basketItemRemoved = domain.defineEvent({
        name: "basketItemRemoved"
    },
    function (basketItemId, aggregate) {
        _.remove(aggregate.get("basket"), function (item) {
            return item.id === basketItemId;
        });
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------------------------------------------------------------
// make order
// ----------------------------------------------------------------
var createOrder = domain.defineCommand({
    name: "createOrder",
    exists: true
}, function (data, aggregate) {
    var basket = aggregate.get("basket");

    var orderItems = [];
    basket.forEach(function (basketItem) {
        var orderItem = new models.OrderItem({id: basketItem.item.id}, basketItem.number);
        orderItems.push(orderItem);
    });

    var order = new models.Order(uuid.v4().toString(), "pending", orderItems, new Date());
    aggregate.apply("orderCreated", order);
});

var orderCreated = domain.defineEvent({
        name: "orderCreated"
    },
    function (order, aggregate) {
        aggregate.get("orders").push(order);

        // clear the basket...
        aggregate.set("basket", []);
    });

var confirmOrder = domain.defineCommand({
    name: "confirmOrder",
    exists: true
}, function (enrichedOrder, aggregate) {
    enrichedOrder.status = "confirmed";

    aggregate.apply("orderConfirmed", enrichedOrder);
});

var orderConfirmed = domain.defineEvent({
        name: "orderConfirmed"
    },
    function (enrichedOrder, aggregate) {
        _.remove(aggregate.get("orders"), function (pendingOrder) {
            return pendingOrder.id === enrichedOrder.id;
        });

        aggregate.get("orders").push(enrichedOrder);
    });
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


var precondition_createUser_mandatoryAttributesSet = domain.definePreCondition({
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

var precondition_createUser_loginNameMustBeUnique = domain.definePreCondition({
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

var precondition_changeUser_allowedChanges = domain.definePreCondition({
    name: "changeUser",
    description: "change is not allowed",
}, function (data, aggregate) {
    //only firstname, lastname, loginname and password can be changed!!!
    // --> check here...
});


var businessRule_makeOrder_basketMustNotBeEmpty = domain.definePreCondition({
    name: ["createOrder"],
    description: "basket must not be empty",
}, function (data, aggregate) {
    if (aggregate.get("basket").length === 0) {
        throw new Error();
    }
});

module.exports = [user,
    createCustomer, customerCreated,
    createAdmin, adminCreated,
    changeUser, userChanged,
    deleteUser, userDeleted,
    addBasketItem, basketItemAdded,
    removeBasketItem, basketItemRemoved,
    createOrder, orderCreated,
    confirmOrder, orderConfirmed,
    // preconditions
    precondition_createUser_mandatoryAttributesSet,
    precondition_createUser_loginNameMustBeUnique,
    precondition_changeUser_allowedChanges,
    // business rules...
    businessRule_makeOrder_basketMustNotBeEmpty];