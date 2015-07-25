/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />
"use strict";
exports.db = {
    uri: "mongodb://localhost:27017/tb"
};
exports.app = {
    title: "Trinkbörse",
    description: "blah blah",
    keywords: "xxx"
};
exports.log = {
    // Can specify one of "combined", "common", "dev", "short", "tiny"
    format: "dev",
    // Stream defaults to process.stdout
    options: {
        stream: "stdout"
    }
};
exports.port = process.env.PORT || 3000;
exports.urls = {
    home: "http://localhost" + ":" + exports.port + "/",
    drinks: "http://localhost" + ":" + exports.port + "/drinks/"
};
//# sourceMappingURL=config.js.map