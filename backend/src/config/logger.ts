/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
import log4js = require("log4js");
import _ = require("lodash");

var config:log4js.IConfig = {
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
    replaceConsole: true
}

log4js.configure(config);


var logger:log4js.Logger = log4js.getLogger();
logger.setLevel("trace");


// special handling and function overrides for logger because if passed in an array of errors it will not be
// properly disseminated...
function isOnlyErrorsArray(arguments) {
    return _.isArray(arguments) && _.every(arguments, item => item instanceof Error);
}

function flattenErrors(arguments) {
    var x = [];
    _.forEach(arguments, item => {
        if (isOnlyErrorsArray(item)) {
            //var errors = Array.prototype.slice.call(item);
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

export = logger;
