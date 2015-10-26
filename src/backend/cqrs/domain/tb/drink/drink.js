"use strict";

var _ = require("lodash");
var domain = require("cqrs-domain");
var models = require("../../../../core/models");

var drink = domain.defineAggregate({
        name: "drink",
        defaultCommandPayload: "payload",
        defaultEventPayload: "payload",
        defaultPreConditionPayload: "payload"
    },
    {
        name: "",
        description: "",
        quantity: "",
        category: "",
        tags: [],
        basePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        priceStep: 0,
        priceTicks: [],
        creationDate: null,
        modificationDate: null
    });

var createDrink = domain.defineCommand({
    name: "createDrink",
    existing: false,
}, function (data, aggregate) {
    //enrich data with what we have in the aggregate atm...
    data = _.defaults(data, aggregate.attributes);
    data.id = aggregate.id;
    data.creationDate = new Date();
    data.modificationDate = null;
    data.priceTicks = [new models.PriceTick(data.basePrice, 0, "initial")];
    aggregate.apply("drinkCreated", data);
});

var drinkCreated = domain.defineEvent({
        name: "drinkCreated"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

var changeDrink = domain.defineCommand({
    name: "changeDrink",
    existing: true,
}, function (data, aggregate) {
    data.modificationDate = new Date();
    aggregate.apply("drinkChanged", data);
});

var drinkChanged = domain.defineEvent({
        name: "drinkChanged"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

var deleteDrink = domain.defineCommand({
    name: "deleteDrink"
}, function (data, aggregate) {
    aggregate.apply("drinkDeleted", data);
});

var drinkDeleted = domain.defineEvent({
        name: "drinkDeleted"
    },
    function (data, aggregate) {
        aggregate.destroy();
    });

var changePrice = domain.defineCommand({
    name: "changePrice",
    existing: true,
}, function (data, aggregate) {

    var currentPrice = aggregate.get("priceTicks")[0].price;
    var newPrice = parseFloat(data.price.toFixed(2));
    var delta = parseFloat((data.price - currentPrice).toFixed(2));

    var priceTick = new models.PriceTick(newPrice, delta, data.reason);

    aggregate.apply("priceChanged", priceTick);
});

var priceChanged = domain.defineEvent({
        name: "priceChanged"
    },
    function (priceTick, aggregate) {
        aggregate.get("priceTicks").unshift(priceTick);
    });

var resetPrice = domain.defineCommand({
    name: "resetPrice",
    existing: true,
}, function (data, aggregate) {

    var price = aggregate.get("priceTicks")[0].price;
    var newPrice = aggregate.get("basePrice");
    var delta = parseFloat((newPrice - price).toFixed(2));
    var reason = "reset";
    var priceTick = new models.PriceTick(newPrice, delta, reason);

    aggregate.apply("priceReset", priceTick);
});

var priceReset = domain.defineEvent({
        name: "priceReset"
    },
    function (priceTick, aggregate) {
        aggregate.get("priceTicks").unshift(priceTick);
    });
//
//
//=============================================================================
// preconditions
//=============================================================================
var precondition_price_mustBeGreaterThanOrEqualMinPrice = domain.definePreCondition({
    name: ["changePrice"],
    description: "price must be greater than or equal the min price",
}, function (data, aggregate) {

    if (data.price < aggregate.get("minPrice")) {
        throw new Error();
    }
});

var precondition_price_mustBeLowerThanOrEqualMaxPrice = domain.definePreCondition({
    name: ["changePrice"],
    description: "price must be lower than or equal the max price",
}, function (data, aggregate) {

    if (data.price > aggregate.get("maxPrice")) {
        throw new Error();
    }
});

//=============================================================================
// business rules
//=============================================================================
//var businessRule_currentPrice_mustBeGreaterThanOrEqualBottomPrice = domain.defineBusinessRule({
//    name: ["changePrice"],
//    description: "price must be greater than or equal the min price",
//}, function (changed, previous, events, command) {
//    if (!(changed.get("priceTicks") >= changed.get("minPrice"))) {
//        throw new Error();
//    }
//});
//
//var businessRule_currentPrice_mustBeLowerThanOrEqualTopPrice = domain.defineBusinessRule({
//    name: ["changePrice"],
//    description: "price must be lower than or equal the max price",
//}, function (changed, previous, events, command) {
//    if (!(changed.get("currentPrice") <= changed.get("maxPrice"))) {
//        throw new Error();
//    }
//});

module.exports = [drink,
    createDrink, drinkCreated,
    changeDrink, drinkChanged,
    deleteDrink, drinkDeleted,
    changePrice, priceChanged,
    resetPrice, priceReset,
    // preconditions
    precondition_price_mustBeGreaterThanOrEqualMinPrice,
    precondition_price_mustBeLowerThanOrEqualMaxPrice,
    // business rules
    //businessRule_currentPrice_mustBeGreaterThanOrEqualBottomPrice,
    //businessRule_currentPrice_mustBeLowerThanOrEqualTopPrice
];