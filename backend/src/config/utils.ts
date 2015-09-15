/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import _ = require("lodash");
import glob = require("glob");

/**
 * Get files by glob patterns
 */
export function getGlobbedFiles(globPatterns, removeRoot?) {
    // For context switching
    var _this = this;

    // URL paths regex
    var urlRegex = new RegExp("^(?:[a-z]+:)?\/\/", "i");

    // The output array
    var output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {

            var files = glob.sync(globPatterns);
            if (removeRoot) {
                files = files.map(function(file) {
                    return file.replace(removeRoot, "");
                });
            }

            output = _.union(output, files);
        }
    }

    return output;
};