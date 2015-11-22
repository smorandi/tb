/**
 * Created by Stefano on 19.09.2015.
 */
"use strict";

var _get = function get(_x, _x2, _x3) {
    var _again = true;
    _function: while (_again) {
        var object = _x, property = _x2, receiver = _x3;
        desc = parent = getter = undefined;
        _again = false;
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);
            if (parent === null) {
                return undefined;
            } else {
                _x = parent;
                _x2 = property;
                _x3 = receiver;
                _again = true;
                continue _function;
            }
        } else if ("value" in desc) {
            return desc.value;
        } else {
            var getter = desc.get;
            if (getter === undefined) {
                return undefined;
            }
            return getter.call(receiver);
        }
    }
};

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var User = (function () {
    function User(firstname, lastname, loginname, password, type) {
        _classCallCheck(this, User);

        this.id = null;
        this.firstname = firstname;
        this.lastname = lastname;
        this.loginname = loginname;
        this.password = password;
        this.type = type;
        this.creationDate = null;
        this.modificationDate = null;
    }

    _createClass(User, [{
        key: "isAdmin",
        value: function isAdmin() {
            return this.type === "admin";
        }
    }, {
        key: "isRoot",
        value: function isRoot() {
            return this.type === "root";
        }
    }, {
        key: "isCustomer",
        value: function isCustomer() {
            return this.type === "customer";
        }
    }]);

    return User;
})();

var Customer = (function (_User) {
    _inherits(Customer, _User);

    function Customer(firstname, lastname, loginname, password) {
        _classCallCheck(this, Customer);

        _get(Object.getPrototypeOf(Customer.prototype), "constructor", this).call(this, firstname, lastname, loginname, password, "customer");
    }

    return Customer;
})(User);

var Admin = (function (_User2) {
    _inherits(Admin, _User2);

    function Admin(firstname, lastname, loginname, password) {
        _classCallCheck(this, Admin);

        _get(Object.getPrototypeOf(Admin.prototype), "constructor", this).call(this, firstname, lastname, loginname, password, "admin");
    }

    return Admin;
})(User);

var Root = (function (_User3) {
    _inherits(Root, _User3);

    function Root(firstname, lastname, loginname, password) {
        _classCallCheck(this, Root);

        _get(Object.getPrototypeOf(Root.prototype), "constructor", this).call(this, firstname, lastname, loginname, password, "root");
    }

    return Root;
})(User);

var Drink = function Drink(name, description, quantity, quantityUnit, category, tags, basePrice, minPrice, maxPrice, priceStep) {
    _classCallCheck(this, Drink);

    this.id = null;
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.quantityUnit = quantityUnit;
    this.category = category;
    this.tags = tags;
    this.basePrice = basePrice;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.priceStep = priceStep;
    this.priceTicks = null;
    this.creationDate = null;
    this.modificationDate = null;
};

var Order = function Order(id, status, orderItems, timestamp, totalPrice) {
    _classCallCheck(this, Order);

    this.id = id ? id : null;
    this.status = status ? status : null;
    this.orderItems = orderItems ? orderItems : [];
    this.timestamp = timestamp ? timestamp : new Date();
    this.totalPrice = totalPrice ? totalPrice : null;
};

var OrderItem = function OrderItem(item, number, price) {
    _classCallCheck(this, OrderItem);

    this.number = number;
    this.item = item ? item : {};
    this.price = price ? price : null;
};

var BasketItem = function BasketItem(id, item, number) {
    _classCallCheck(this, BasketItem);

    this.id = id ? id : null;
    this.number = number;
    this.item = item ? item : {};
};

var Event = function Event(name, timestamp) {
    _classCallCheck(this, Event);

    this.name = name;
    this.timestamp = timestamp ? timestamp : new Date();
};

var PriceTick = function PriceTick(price, delta, reason, timestamp) {
    _classCallCheck(this, PriceTick);

    this.price = price;
    this.delta = delta;
    this.reason = reason ? reason : "unknown";
    this.timestamp = timestamp ? timestamp : new Date();
};

var PriceEntry = function PriceEntry(price, reason) {
    _classCallCheck(this, PriceEntry);

    this.price = price;
    this.reason = reason ? reason : "unknown";
};

module.exports = {
    Order: Order,
    OrderItem: OrderItem,
    BasketItem: BasketItem,
    Event: Event,
    PriceTick: PriceTick,
    PriceEntry: PriceEntry,
    Drink: Drink,
    User: User,
    Customer: Customer,
    Admin: Admin,
    Root: Root
};