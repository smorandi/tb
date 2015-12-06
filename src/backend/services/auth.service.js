/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var auth = require("basic-auth");
var _ = require("lodash");
var HTTPErrors = require("http-custom-errors");

var config = require("../config");
var logger = require("../utils/logger");
var usersCollection = require("../cqrs/viewmodels/users/collection");

function getUser(credentials, callback) {
    usersCollection.findViewModels({loginname: credentials.name}, {limit: 1}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else if (_.isEmpty(docs)) {
            callback(new HTTPErrors.UnauthorizedError("User not found: '%s'", credentials.name));
        }
        else if (credentials.pass !== docs[0].toJSON().password) {
            callback(new HTTPErrors.UnauthorizedError("Invalid Password: '%s'", credentials.pass));
        }
        else {
            callback(null, docs[0].toJSON());
        }
    });
}

exports.authenticate = function (req, callback) {
    var credentials = auth(req);
    if (credentials) {
        getUser(credentials, function (err, user) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, user.type === config.userTypes.admin, user.type === config.userTypes.root, user);
            }
        });
    }
    else {
        callback(new HTTPErrors.UnauthorizedError("Basic-auth header missing"));
    }
};