/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
var path = require("path");
"use strict";
exports.db = {
    uri: "mongodb://localhost:27017/tb",
    options: null
};
exports.app = {
    title: "Trinkbörse",
    description: "blah blah",
    keywords: "xxx"
};
exports.port = process.env.PORT || 3000;
var homeUrl = "";
exports.urls = {
    home: homeUrl,
    drinks: homeUrl + "/drinks",
    users: homeUrl + "/users",
    customers: homeUrl + "/customers",
    engine: homeUrl + "/engine"
};
exports.serverRoot = path.join(__dirname + "/../..");
//# sourceMappingURL=config.js.map