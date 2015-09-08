"use strict";

var _ = require("lodash");
var domain = require("cqrs-domain");

var drink = domain.defineAggregate({
        name: "drink",
        defaultCommandPayload: "payload",
        defaultEventPayload: "payload",
        defaultPreConditionPayload: 'payload'
    },
    {
        name: "name",
        alcoholic: true,
        description: "description",
        quantity: "quantity",
        category: "category",
        basePrice: "price",
        bottomPrice: 0,
        topPrice: 100
    });

var createDrinkCmd = domain.defineCommand({
    name: "createDrink",
    existing: false,
}, function (data, aggregate) {
    //enrich data with what we have in the aggregate atm...
    data = _.defaults(data, aggregate.attributes);
    aggregate.apply("drinkCreated", data);
});

var changeDrinkCmd = domain.defineCommand({
    name: "changeDrink",
    revision: "payload._revision",
    existing:true,
}, function (data, aggregate) {
    aggregate.apply("drinkChanged", data);
});

var deleteDrinkCmd = domain.defineCommand({
    name: "deleteDrink"
}, function (data, aggregate) {
    aggregate.apply("drinkDeleted", data);
});

var drinkCreatedEvt = domain.defineEvent({
        name: "drinkCreated"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

var drinkChangedEvt = domain.defineEvent({
        name: "drinkChanged"
    },
    function (data, aggregate) {
        aggregate.set(data);
    });

var drinkDeletedEvt = domain.defineEvent({
        name: "drinkDeleted"
    },
    function (data, aggregate) {
        aggregate.destroy();
    });

module.exports = [drink,
    createDrinkCmd, drinkCreatedEvt,
    changeDrinkCmd, drinkChangedEvt,
    deleteDrinkCmd, drinkDeletedEvt];