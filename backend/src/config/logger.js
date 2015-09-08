/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
var log4js = require("log4js");
var config = {
    "appenders": [
        {
            //"category": "console",
            "type": "console",
            "layout": {
                "type": "pattern",
                "pattern": "%d [%[%-5p%]] - %m"
            }
        }
    ],
    "replaceConsole": true
};
log4js.configure(config);
var logger = log4js.getLogger();
module.exports = logger;
//# sourceMappingURL=logger.js.map