/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />
'use strict';
var config = require('./config');
var fs = require('fs');
function getLogFormat() {
    return config.log.format;
}
exports.getLogFormat = getLogFormat;
;
function getLogOptions() {
    var options = {};
    try {
        if (config.log.options.stream !== "stdout") {
            options = {
                stream: fs.createWriteStream(process.cwd() + '/' + config.log.options.stream, { flags: 'a' })
            };
        }
    }
    catch (e) {
        options = {};
    }
    return options;
}
exports.getLogOptions = getLogOptions;
;
//# sourceMappingURL=logger.js.map