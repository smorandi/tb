/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var drinksCollection = require("../../cqrs/viewmodels/drinks/collection");
var dashboardCollection = require("../../cqrs/viewmodels/dashboard/collection");

var models = require("../models/models");
var logger = require("../../config/logger");
var _ = require("lodash");

function orderContainsDrinkId(order, id) {
    var orderItemItems = _.map(order.orderItems, "item");
    return _.find(orderItemItems, {id: id}) !== undefined;
}

function ordersContainsOrderId(order) {
    return _.find(orders, {id: order.id}) !== undefined;
}

function getDateOfLastOrderContainingDrink(id, callback) {
    dashboardCollection.loadViewModel(id, function (err, doc) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, doc.toJSON().lastOrderTimestamp);
        }
    });
}

function enrichOrderWithCurrentPrice(order, callback) {
    var id = order.id;
    var timestamp = order.timestamp;
    var orderItems = order.orderItems;

    drinksCollection.findViewModels({}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else if (_.isEmpty(docs)) {
            callback(new Error("no drinks found for orderItem"));
        }
        else {
            var drinks = _.invoke(docs, "toJSON");

            _.forEach(orderItems, function (orderItem) {
                var drink = _.find(drinks, {id: orderItem.item.id});

                orderItem.item.price = drink.priceTicks[0].price;
                orderItem.item.name = drink.name;
                orderItem.price = orderItem.number * drink.priceTicks[0].price;
                order.totalPrice += orderItem.price;
            });


            callback(null, order);
        }
    });
}

module.exports = {
    enrichOrderWithCurrentPrice: enrichOrderWithCurrentPrice,
    orderContainsDrinkId: orderContainsDrinkId,
    ordersContainsOrderId: ordersContainsOrderId
};