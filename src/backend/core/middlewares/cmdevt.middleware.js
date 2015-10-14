/**
 * Created by Stefano on 14.10.2015.
 */
"use strict";

var config = require("../../config");

module.exports = function (req, res, next) {
    res.handleEvent = function (onSuccess) {
        return function (event) {
            if (event[config.getDefaultEvtDefinitions().name] === "rejectedCommand") {
                next(event[config.getDefaultEvtDefinitions().payload].reason);
            }
            else {
                onSuccess(event);
            }
        };
    };

    return next();
};
