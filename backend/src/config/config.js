/// <reference path="../../typings/tsd.d.ts" />
var path = require("path");
"use strict";
exports.db = {
    uri: "mongodb://localhost:27017/tb",
    options: null,
};
exports.app = {
    title: "Trinkbörse",
    description: "blah blah",
    keywords: "xxx"
};
exports.port = process.env.PORT || 3000;
exports.urls = {
    home: "/home",
    dashboard: "/dashboard",
    drinks: "/drinks",
    customers: "/customers",
    baskets: "/baskets",
    orders: "/orders",
    admin: "/admin",
};
exports.serverRoot = path.join(__dirname + "/../..");
//# sourceMappingURL=config.js.map