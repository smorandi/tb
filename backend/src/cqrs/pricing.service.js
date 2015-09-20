/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var drinksCollection = require("../cqrs/viewmodels/drinks/collection");

var models = require("./models/models");
var logger = require("../config/logger");
var _ = require("lodash");


function orderContainsDrinkId(order, id) {
    var orderItemItems = _.map(order.orderItems, "item");
    return _.find(orderItemItems, {id: id}) !== undefined;
}

function ordersContainsOrderId(order) {
    return _.find(orders, {id: order.id}) !== undefined;
}

function enrichOrderWithCurrentPrice(order, callback) {
    var id = order.id;
    var timestamp = order.timestamp;
    var orderItems = order.orderItems;

    drinksCollection.findViewModels({}, function (err, docs) {
        if (err) {
            callback(err);
            return;
        }
        else if (_.isEmpty(docs)) {
            callback(new Error("no drinks found for orderItem"));
            return;
        }
        else {
            var drinks = _.map(docs, function (doc) {
                return doc.toJSON();
            });

            _.forEach(orderItems, function (orderItem) {
                var currentPrice = _.result(_.find(drinks, {id: orderItem.item.id}), "priceTicks[0].price");
                orderItem.price = orderItem.number * currentPrice;
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