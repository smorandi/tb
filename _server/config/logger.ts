/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />
import log4js = require("log4js");

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
}

log4js.configure(<any>config);
var logger = log4js.getLogger();

export = logger;
