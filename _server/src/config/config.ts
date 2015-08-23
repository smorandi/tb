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

var homeUrl = "";
export var urls = {
    home: homeUrl,
    drinks: homeUrl + "/drinks",
    users: homeUrl + "/users",
    engine: homeUrl + "/engine",
};

export var serverRoot = path.join(__dirname + "/..");