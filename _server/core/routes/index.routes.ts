/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../typings/tsd.d.ts" />
"use strict";

import logger = require("../../config/logger");

function init(app) {
    logger.trace("initializing home routes...")

    app.route('/')
        .get((req, res, next) => res.render('index', {title: 'Express'}));
}

export = init;
