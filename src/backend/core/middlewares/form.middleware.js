/**
 * Created by Stefano on 14.10.2015.
 */
"use strict";

var util = require("util");

module.exports = function (req, res, next) {
    res.form = function (resource, json) {

        var o = {};

        if (resource) {
            o["application/hal+json"] = function () {
                res.json(util.isFunction(resource) ? resource() : resource);
            }
        }

        if (json) {
            o["application/json"] = function () {
                res.json(util.isFunction(json) ? json() : json);
            }
        }

        res.format(o);
    };

    return next();
};
