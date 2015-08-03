/**
 * Created by Stefano on 26.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import generic = require("./generic.controller");
import config = require("../../config/config");
import impl = require("../models/impl");

class UsersController extends generic.GenericController<impl.IUserDocument> {
    constructor() {
        super(impl.userRepository);
    }

    public getBaseUrl():string {
        return config.urls.users;
    }
}

var usersController = new UsersController();
export = usersController;