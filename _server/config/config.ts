/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />

"use strict";

export var db = {
    uri: "mongodb://localhost:27017/tb",
};

export var app = {
    title: "Trinkbörse",
    description: "blah blah",
    keywords: "xxx"
};

export var log = {
    // Can specify one of "combined", "common", "dev", "short", "tiny"
    format: "dev",
    // Stream defaults to process.stdout
    options: {
        stream: "stdout"
        //stream: "access.log"
    }
};

export var port = process.env.PORT || 3000;

export var urls = {
    home: "http://localhost" + ":" + port + "/",
    drinks: "http://localhost" + ":" + port + "/drinks/",
};