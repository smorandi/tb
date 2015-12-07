/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var async = require("async");
var config = require("../config");

var pricingCollection = require("../cqrs/viewmodels/pricing/collection");

var models = require("../core/models");
var logger = require("../utils/logger");
var _ = require("lodash");

function orderContainsDrinkId(order, id) {
    var orderItemItems = _.map(order.orderItems, "item");
    return _.find(orderItemItems, {id: id}) !== undefined;
}

function enrichOrderWithCurrentPrice(order, callback) {
    pricingCollection.findViewModels({}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else if (_.isEmpty(docs)) {
            callback(new Error("no drinks available"));
        }
        else {
            var drinks = _.invoke(docs, "toJSON");

            _.forEach(order.orderItems, function (orderItem) {
                var drink = _.find(drinks, {id: orderItem.item.id});

                orderItem.item.price = drink.price;
                orderItem.item.name = drink.name;
                orderItem.price = orderItem.number * drink.price;
                order.totalPrice += orderItem.price;
            });


            callback(null, order);
        }
    });
}

function calculateNewPrice(currentPrice, priceStep, maxPrice, number) {
    return Math.min(currentPrice + (priceStep * number), maxPrice);
}

function calculateNewPricesForDrinksInOrder(order, callback) {
    pricingCollection.findViewModels({}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else if (_.isEmpty(docs)) {
            callback(new Error("no drinks available"));
        }
        else {
            var drinkIdPriceMap = {};
            var drinks = _.invoke(docs, "toJSON");

            _.forEach(order.orderItems, function (orderItem) {
                var drink = _.find(drinks, {id: orderItem.item.id});

                if (drink) {
                    if (drinkIdPriceMap[drink.id]) {
                        var currentPrice = drinkIdPriceMap[drink.id];
                        drinkIdPriceMap[drink.id] = calculateNewPrice(currentPrice, drink.priceStep, drink.maxPrice, orderItem.number);
                    }
                    else {
                        drinkIdPriceMap[drink.id] = calculateNewPrice(drink.price, drink.priceStep, drink.maxPrice, orderItem.number);
                    }
                }
            });

            callback(null, drinkIdPriceMap);
        }
    });
}

function calculateNewPricesForTimebase(timebase, gracePeriod, callback) {
    pricingCollection.findViewModels({}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else if (_.isEmpty(docs)) {
            callback(new Error("no drinks available"));
        }
        else {
            var drinkIdPriceMap = {};
            var pricingDrinks = _.invoke(docs, "toJSON");
            _.forEach(pricingDrinks, function (pricingDrink) {
                if (pricingDrink.priceReductionTimeBase) {
                    var drinkTimeBase = pricingDrink.priceReductionTimeBase.getTime();

                    // only do this for any drinks which have not been ordered since more than the given grace period...
                    if ((timebase - drinkTimeBase) > gracePeriod) {
                        var currentPrice = pricingDrink.price;
                        var priceStep = pricingDrink.priceStep;
                        var minPrice = pricingDrink.minPrice;

                        var newPrice = Math.max(currentPrice - priceStep, minPrice);

                        drinkIdPriceMap[pricingDrink.id] = newPrice;
                    }
                }
            });

            callback(null, drinkIdPriceMap);
        }
    });
}

module.exports = {
    enrichOrderWithCurrentPrice: enrichOrderWithCurrentPrice,
    orderContainsDrinkId: orderContainsDrinkId,
    calculateNewPricesForDrinksInOrder: calculateNewPricesForDrinksInOrder,
    calculateNewPricesForTimebase: calculateNewPricesForTimebase
};