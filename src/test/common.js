/**
 * Created by Stefano on 13.10.2015.
 */
"use strict";

var config = require("../backend/config");
var url = require("url");
var path = require("path");


var traverson = require("traverson");
var JsonHalAdapter = require("traverson-hal");

// register the traverson-hal plug-in for media type "application/hal+json"
traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
exports.traverson = traverson;

var serverUrl = "http://" + config.server.host + ":" + config.server.port + "/";

exports.urls = {
    root: url.resolve(serverUrl, config.urls.root),
    home: url.resolve(serverUrl, config.urls.home),
    dashboard: url.resolve(serverUrl, config.urls.dashboard),
    customers: url.resolve(serverUrl, config.urls.customers),
    admins: url.resolve(serverUrl, config.urls.admins),
    baskets: url.resolve(serverUrl, config.urls.baskets),
    drinks: url.resolve(serverUrl, config.urls.drinks),
    system: url.resolve(serverUrl, config.urls.system),
};

exports.paths = {
    toHome: ["home"],
    toBasket: ["home", "basket"],
    toOrders: ["home", "orders"],
    toRegisterCustomer: ["registerCustomer"],
    toCreateBasketItem: ["home", "basket", "create"],
    toCreateOrder: ["home", "basket", "createOrder"],
    toDashboard: ["dashboard"],
    toDrinks: ["home", "drinks"],
    toProfile: ["home", "profile"],
    toSystem: ["home", "system"],
    toAdmins: ["home", "admins"],
    toCreateAdmin: ["home", "admins", "create"],
    toCustomers: ["home", "customers"],
    toUsers: ["home", "users"],
    toCustomerBaskets: ["home", "customerBaskets"],
    toCustomerOrders: ["home", "customerOrders"],
};

function createHeader(loginname, password) {
    return {
        headers: {
            "Authorization": "Basic " + new Buffer(loginname + ":" + password).toString("base64")
        }
    };
}

exports.headers = {
    contentType: {
        json: {
            headers: {
                "Content-Type": "application/json"
            }
        }
    },
    accept: {
        json: {
            headers: {
                "Accept": "application/json"
            }
        },
        hal: {
            headers: {
                "Accept": "application/hal+json"
            }
        }
    },
    auth: {
        createHader: createHeader,
        defaults: {
            customer: createHeader("customer", "customer"),
            admin: createHeader("admin", "admin"),
            root: createHeader("root", "root")
        }
    }
};


exports.importTest = function (name, caller, p) {
    describe(name, function () {
        require(path.join(caller, p));
    });
}