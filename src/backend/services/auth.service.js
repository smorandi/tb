/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var auth = require("basic-auth");
var _ = require("lodash");
var util = require("util");
var HTTPErrors = require("http-custom-errors");

var config = require("../config");
var logger = require("../utils/logger");
var usersCollection = require("../cqrs/viewmodels/users/collection");

function getUser(credentials, callback) {
    if (credentials.name === "root" && credentials.pass === "root") {
        callback(null, {firstname: "root", lastname: "root", loginname: "root", password: "root", type: "root"});
    }
    else {
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
}

function authenticate(req, callback) {
    var credentials = auth(req);
    if (credentials) {
        getUser(credentials, function (err, user) {
            if (err) {
                callback(err, false, false);
            }
            else {
                callback(null, true, user.type === config.userTypes.admin, user.type === config.userTypes.root, user);
            }
        });
    }
    else {
        callback(null, false, false, false);
    }
}

function requireLogin(req, res, next) {
    authenticate(req, function (err, isAuthenticated, isAdmin, isRoot, user) {
        if (err) {
            next(err);
        }
        else if (isAuthenticated) {
            req.user = user;
            next();
        }
        else {
            next(new HTTPErrors.UnauthorizedError("Basic-auth header missing"));
        }
    });
}

function requireUserType(req, res, next, type) {
    // this should really never be the case if routes are correctly set up...
    if (!req.user || !req.user.type) {
        next(new HTTPErrors.UnauthorizedError("User is undefined"));
    }
    // so we are of the type root, well ok, continue...
    else if (req.user.type === config.userTypes.root) {
        next();
    }
    // so we are of the type, ok, continue...
    else if (req.user.type === type) {
        next();
    }
    // otherwise, c ya...
    else {
        next(new HTTPErrors.ForbiddenError("User '%s' is not allowed to access url '%s'", req.user.loginname, req.originalUrl));
    }
}

function requireAdmin(req, res, next) {
    requireUserType(req, res, next, config.userTypes.admin);
}

function requireCustomer(req, res, next) {
    requireUserType(req, res, next, config.userTypes.customer);
}

function requireMatchingUserId(req, res, next, id) {
    // if the ids match, we can continue...
    if (req.user.id === id) {
        next();
    }
    // if the ids don't match, but we are admin (or root), we can continue...
    else if (req.user.type === config.userTypes.admin || req.user.type === config.userTypes.root) {
        next();
    }
    // otherwise, well, bye bye...
    else {
        next(new HTTPErrors.ForbiddenError("Id mismatch"));
    }
}

module.exports = {
    authenticate: authenticate,
    requireLogin: requireLogin,
    requireAdmin: requireAdmin,
    requireCustomer: requireCustomer,
    requireMatchingUserId: requireMatchingUserId
};