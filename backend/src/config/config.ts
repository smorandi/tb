/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
import path = require("path");
"use strict";

export var db = {
    uri: "mongodb://localhost:27017/tb",
    options: null,
};

export var app = {
    title: "Trinkbörse",
    description: "blah blah",
    keywords: "xxx"
};

export var port = process.env.PORT || 3000;

export var urls = {
    home: "/home",
    dashboard: "/dashboard",
    drinks: "/drinks",
    customers: "/customers",
    baskets: "/baskets",
    orders: "/orders",
    admin: "/admin",
};

export var serverRoot = path.join(__dirname + "/../..");