/**
 * Created by Stefano on 25.07.2015.
 */
"use strict";

var log4js = require("log4js");
var _ = require("lodash");
var config = require("../config");

var configuration = {
    appenders: [
        {
            //"category": "console",
            "type": "console",
            "layout": {
                "type": "pattern",
                "pattern": "%d [%[%-5p%]] - %m"
            }
        }
    ],
    replaceConsole: false
}

log4js.configure(configuration);

var logger = log4js.getLogger();
logger.setLevel(config.logger.level);


// special handling and function overrides for logger because if passed in an array of errors it will not be
// properly disseminated...
function isOnlyErrorsArray(args) {
    return _.isArray(args) && _.every(args, function (item) {
            return item instanceof Error;
        });
}

function flattenErrors(args) {
    var x = [];
    _.forEach(args, function (item) {
        if (isOnlyErrorsArray(item)) {
            x = x.concat(item);
        }
        else {
            x.push(item);
        }
    });

    return x;
}

logger.warn = function () {
    logger.__proto__.warn.apply(logger, flattenErrors(arguments));
}
logger.error = function () {
    logger.__proto__.error.apply(logger, flattenErrors(arguments));
}
logger.fatal = function () {
    logger.__proto__.fatal.apply(logger, flattenErrors(arguments));
}

module.exports = logger;
