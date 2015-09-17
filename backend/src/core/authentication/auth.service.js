/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var auth = require("basic-auth");
var _ = require("lodash");
var logger = require("../../config/logger");
var usersCollection = require("../../cqrs/viewmodels/users/collection");

function userExists(loginname, callback) {
    usersCollection.findViewModels({loginname: loginname}, function (err, docs) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, !_.isEmpty(docs));
        }
    });
}

function getUser(credentials, callback) {
    usersCollection.findViewModels({loginname: credentials.name}, {limit: 1}, function (err, doc) {
        if (err) {
            callback(err);
        }
        else if (_.isEmpty(doc)) {
            callback(new Error("not existent"));
        }
        else if (credentials.pass !== doc[0].toJSON().password) {
            callback(new Error("password invalid"));
        }
        else {
            callback(null, doc[0].toJSON());
        }
    });
}


function authenticate(req, callback) {
    var credentials = auth(req);
    if (credentials) {
        getUser(credentials, function (err, user) {
            if (err) {
                callback(err, false);
            }
            else {
                callback(null, true, user.type === "admin", user);
            }
        });
    }
    else {
        logger.debug("no credentials in request");
        callback(null, false);
    }
}

module.exports = {authenticate: authenticate};