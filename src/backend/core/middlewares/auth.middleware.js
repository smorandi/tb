/**
 * Created by Stefano on 14.10.2015.
 */
"use strict";

var HTTPErrors = require("http-custom-errors");
var authService = require("../../services/auth.service");
var config = require("../../config");

exports.requireLogin = function (req, res, next) {
    authService.authenticate(req, function (err, isAdmin, isRoot, user) {
        if (err) {
            next(err);
        }
        else {
            req.user = user;
            next();
        }
    });
};

exports.requireUserType = function (req, res, next, type) {
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
};

exports.requireAdmin = function (req, res, next) {
    exports.requireUserType(req, res, next, config.userTypes.admin);
};

exports.requireRoot = function (req, res, next) {
    exports.requireUserType(req, res, next, config.userTypes.root);
};

exports.requireCustomer = function (req, res, next) {
    exports.requireUserType(req, res, next, config.userTypes.customer);
};

exports.requireMatchingUserId = function (req, res, next, id) {
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
};

exports.requireMatchingUserIdByKey = function (paramIdKey) {
    return function (req, res, next) {
        // if the ids match, we can continue...
        if (req.user.id === req.params[paramIdKey]) {
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
};