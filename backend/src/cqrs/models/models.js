/**
 * Created by Stefano on 19.09.2015.
 */
"use strict";

function Order(id, status, orderItems, timestamp, totalPrice) {
    var _this = this;

    _this.id = id ? id : null;
    _this.status = status ? status : null;
    _this.orderItems = orderItems ? orderItems : [];
    _this.timestamp = timestamp ? timestamp : new Date();
    _this.totalPrice = totalPrice ? totalPrice : null;
}

function OrderItem(item, number, price) {
    var _this = this;

    _this.number = number;
    _this.item = item ? item : {};
    _this.price = price ? price : null;
}

function BasketItem(id, item, number) {
    var _this = this;

    _this.number = number;
    _this.item = item ? item : {};
}

function Event(name, timestamp) {
    var _this = this;

    _this.name = name;
    _this.timestamp = timestamp ? timestamp : new Date();
}

function PriceTick(price, delta, reason, timestamp) {
    var _this = this;

    _this.price = price;
    _this.delta = delta;
    _this.reason = reason ? reason : "unknown";
    _this.timestamp = timestamp ? timestamp : new Date();
}

function PriceEntry(price, reason) {
    var _this = this;

    _this.price = price;
    _this.reason = reason ? reason : "unknown";
}

module.exports = {
    Order: Order,
    OrderItem: OrderItem,
    BasketItem: BasketItem,
    Event: Event,
    PriceTick: PriceTick,
    PriceEntry: PriceEntry
};