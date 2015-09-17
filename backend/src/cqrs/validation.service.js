/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var usersCollection = require("../cqrs/viewmodels/users/collection");
var logger = require("../config/logger");
var _ = require("lodash");

function isUniqueLoginName(name, callback) {
    usersCollection.findViewModels({loginname: name}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, _.isEmpty(docs));
        }
    });
}

module.exports = {isUniqueLoginName: isUniqueLoginName};