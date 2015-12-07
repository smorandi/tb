"use strict";

var _ = require("lodash");
var domain = require("cqrs-domain");
var uuid = require("node-uuid");
var validationService = require("../../../../services/validation.service.js");
var models = require("../../../../core/models");

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
        password: "password"
    });

// ----------------------------------------------------------------
// create customer
// ----------------------------------------------------------------
var createCustomer = domain.defineCommand({
    name: "createCustomer",
    existing: false
}, function (data, aggregate) {
    _.defaults(data, aggregate.attributes);
    data.id = aggregate.id;
    data.type = "customer";
    data.basket = [];
    data.orders = [];
    data.creationDate = new Date();
    data.modificationDate = null;

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
    existing: false
}, function (data, aggregate) {
    _.defaults(data, aggregate.attributes);
    data.id = aggregate.id;
    data.type = "admin";
    data.creationDate = new Date();
    data.modificationDate = null;

    aggregate.apply("adminCreated", data);
});

var adminCreated = domain.defineEvent({
        name: "adminCreated"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

// ----------------------------------------------------------------
// create root
// ----------------------------------------------------------------
var createRoot = domain.defineCommand({
    name: "createRoot",
    existing: false
}, function (data, aggregate) {
    _.defaults(data, aggregate.attributes);
    data.id = aggregate.id;
    data.type = "root";
    data.creationDate = new Date();
    data.modificationDate = null;

    aggregate.apply("rootCreated", data);
});

var rootCreated = domain.defineEvent({
        name: "rootCreated"
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
    existing: true
}, function (data, aggregate) {
    data.modificationDate = new Date();
    data.creationDate = aggregate.get("creationDate");
    data.type = aggregate.get("type");

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
    name: "deleteUser"
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
    existing: true
}, function (data, aggregate) {

    var basketItemId = uuid.v4().toString();
    var basketItem = new models.BasketItem(basketItemId, {id: data.drinkId}, data.number);

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
    existing: true
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
// update item from basket
// ----------------------------------------------------------------
var changeBasketItem = domain.defineCommand({
    name: "changeBasketItem",
    existing: true
}, function (data, aggregate) {
    //DO NOT CHANGE THE AGGREGATE IN HERE!!!
    var basketItem = _.clone(_.find(aggregate.get("basket"), "id", data.basketItemId), true);

    if (data.drinkId) {
        basketItem.item.id = data.drinkId;
    }
    if (data.number) {
        basketItem.number = data.number;
    }

    aggregate.apply("basketItemChanged", basketItem);
});

var basketItemChanged = domain.defineEvent({
        name: "basketItemChanged"
    },
    function (basketItem, aggregate) {
        var index = _.findIndex(aggregate.get("basket"), "id", basketItem.id);
        aggregate.get("basket").splice(index, 1, basketItem);
    });

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

    var orderId = uuid.v4().toString();
    var order = new models.Order(orderId, "pending", orderItems, new Date());
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

var precondition_basketItem_exists = domain.definePreCondition({
    name: "changeBasketItem",
    description: "basket item must exist"
}, function (data, aggregate, callback) {
    if (!data.basketItemId) {
        callback(new Error());
    }
    else {
        var basketItem = _.find(aggregate.get("basket"), "id", data.basketItemId);
        basketItem ?
            callback(null) :
            callback(new Error());
    }
});

var precondition_createUser_mandatoryAttributesSet = domain.definePreCondition({
    name: ["createAdmin", "createCustomer"],
    description: "mandatory attributes must be set"
}, function (data, aggregate, callback) {
    if (!data.firstname) {
        callback(new Error());
    }
    else if (!data.lastname) {
        callback(new Error());
    }
    else if (!data.loginname) {
        callback(new Error());
    }
    else if (!data.password) {
        callback(new Error());
    }
    else {
        callback(null);
    }
});

var precondition_createUser_loginNameMustBeUnique = domain.definePreCondition({
    name: ["createAdmin", "createCustomer"],
    description: "loginname already exists"
}, function (data, aggregate, callback) {
    validationService.isUniqueLoginName(data.loginname, function (err, isUnique) {
        if (err) {
            callback(err);
        }
        else if (!isUnique) {
            callback(new Error());
        }
        else {
            // all ok, loginname is unique...
            callback(null);
        }
    });
});

var precondition_changeUser_allowedChanges = domain.definePreCondition({
    name: "changeUser",
    description: "change is not allowed"
}, function (data, aggregate, callback) {
    //only firstname, lastname, loginname and password can be changed!!!
    // --> check here...
    callback(null);
});


var businessRule_makeOrder_basketMustNotBeEmpty = domain.definePreCondition({
    name: ["createOrder"],
    description: "basket must not be empty"
}, function (data, aggregate, callback) {
    if (aggregate.get("basket").length === 0) {
        callback(new Error());
    }
    else {
        callback(null);
    }
});

module.exports = [user,
    createCustomer, customerCreated,
    createAdmin, adminCreated,
    createRoot, rootCreated,
    changeUser, userChanged,
    deleteUser, userDeleted,
    addBasketItem, basketItemAdded,
    removeBasketItem, basketItemRemoved,
    changeBasketItem, basketItemChanged,
    createOrder, orderCreated,
    confirmOrder, orderConfirmed,
    // preconditions
    precondition_createUser_mandatoryAttributesSet,
    precondition_createUser_loginNameMustBeUnique,
    precondition_changeUser_allowedChanges,
    precondition_basketItem_exists,
    // business rules...
    businessRule_makeOrder_basketMustNotBeEmpty];