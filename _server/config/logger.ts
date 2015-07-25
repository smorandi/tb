/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../typings/tsd.d.ts" />
'use strict';

import morgan = require('morgan');
import config = require('./config');
import fs = require('fs');

export function getLogFormat() {
    return config.log.format;
};

export function getLogOptions() {
    var options = {};

    try {
        if (config.log.options.stream !== "stdout") {
            options = {
                stream: fs.createWriteStream(process.cwd() + '/' + config.log.options.stream, {flags: 'a'})
            };
        }
    } catch (e) {
        options = {};
    }

    return options;
};