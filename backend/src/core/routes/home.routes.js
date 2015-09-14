/**
 * Created by Stefano on 25.07.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var logger = require("../../config/logger");
var config = require("../../config/config");
var HomeController = require("../controllers/home.controller");
function init(app, viewModelOptions, repository, eventBus, domain, cmdSrv) {
    logger.trace("initializing home routes...");
    var controller = new HomeController(repository, eventBus, domain, cmdSrv);
    app.route(config.urls.home).get(function (req, res, next) { return controller.getAsResource(req, res, next); });
}
module.exports = init;
//# sourceMappingURL=home.routes.js.map