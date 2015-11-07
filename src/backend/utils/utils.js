/**
 * Created by Stefano on 26.07.2015.
 */
"use strict";

var _ = require("lodash");

/**
 * Examines and returns the value for a key found in the chain of arguments with which the process was started.
 * Returns the value for a statement such as "myKey=myValue".
 *
 * @param key the key of the statement, i.e. the lefthand protion of a '='
 * @param def the default value to asssume if no key is found
 * @returns {*} will either return the value for the passed in argument or the given default value.
 */
function getValue(key, def) {
    var ak  = key + "=";
    var x = _.findWhere(process.argv, ak);
    var pattern = new RegExp("(^"+ak+")(.*)","");

    return x ? pattern.exec(x)[2] : def;
}

module.exports = {getValue: getValue};