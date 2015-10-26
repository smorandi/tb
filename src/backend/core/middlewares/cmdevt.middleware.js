/**
 * Created by Stefano on 14.10.2015.
 */
"use strict";

var config = require("../../config");

/**
 * Middleware which puts a command event handler function ('handleEvent') onto the response-object for conveniance.
 * It handles command rejections due to failed business-validaitons, preconditions, etc. In case of an error, the error
 * is propagated to next(). In case of a successful command-processing, the given function passed in as a parameter to
 * handleEvent is called with the event received from the event-bus.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = function (req, res, next) {
    res.handleEvent = function (onSuccess) {
        return function (event) {
            if (event[config.getDefaultEvtDefinitions().name] === "rejectedCommand") {
                // in case of a rejection we get an error back, so we propagate it to the next middleware to take care of it...
                next(event[config.getDefaultEvtDefinitions().payload].reason);
            }
            else {
                onSuccess(event);
            }
        };
    };

    return next();
};
