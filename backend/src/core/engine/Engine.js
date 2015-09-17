/**
 * Created by Stefano on 23.08.2015.
 */
/// <reference path="../../../typings/tsd.d.ts" />
"use strict";
var logger = require("../../config/logger");
var config = require("../../config/config");
var drinksCollection = require("../../cqrs/viewmodels/drinks/collection");
var Engine = (function () {
    function Engine() {
        this.status = "initial";
        this.lastChangeDate = new Date();
        this.updateInterval = 5000;
    }
    Engine.prototype.getStatus = function () {
        return this.status;
    };
    Engine.prototype.getLastChangeDate = function () {
        return this.lastChangeDate;
    };
    Engine.prototype.activate = function () {
        var _this = this;
        logger.debug("engine activated...");
        this.status = "activated";
        this.lastChangeDate = new Date();
        timer = setInterval(function () { return _this.loop(); }, this.updateInterval);
    };
    Engine.prototype.deactivate = function () {
        logger.debug("engine deactivated...");
        clearInterval(timer);
        this.status = "deactivated";
        this.lastChangeDate = new Date();
    };
    Engine.prototype.initDashboard = function () {
        logger.debug("initializing dashboard...");
        drinksCollection.findViewModels({}, function (err, docs) {
            if (err) {
                logger.error("error in retrieving drinks", err);
            }
            else {
                exports.dashboard.length = 0;
                docs.forEach(function (doc, index, drinks) {
                    var drink = doc.toJSON();
                    var drinkId = drink.id;
                    var currentPrice = drink.basePrice;
                    var dashboardItem = { id: drinkId, currentPrice: currentPrice };
                    exports.dashboard.push(dashboardItem);
                });
            }
        });
    };
    Engine.prototype.recalculateDashboard = function () {
        logger.debug("recalculating dashboard...");
        drinksCollection.findViewModels({}, function (err, docs) {
            if (err) {
                logger.error("error in retrieving drinks", err);
            }
            else {
                exports.dashboard.length = 0;
                docs.forEach(function (doc, index, drinks) {
                    var drink = doc.toJSON();
                    var drinkId = drink.id;
                    var currentPrice = Math.random() + drink.basePrice;
                    var dashboardItem = { id: drinkId, currentPrice: currentPrice };
                    exports.dashboard.push(dashboardItem);
                });
            }
        });
    };
    Engine.prototype.getDashboard = function () {
        return exports.dashboard;
    };
    Engine.prototype.emitDashboard = function () {
        logger.debug("emitting dashboard...");
        wsIO.sockets.emit(config.websocketChannel_dashboard, exports.dashboard);
    };
    Engine.prototype.loop = function () {
        this.recalculateDashboard();
        this.emitDashboard();
    };
    return Engine;
})();
var wsIO;
var timer;
exports.engine = new Engine();
exports.dashboard = [];
function setWSIO(io) {
    wsIO = io;
}
exports.setWSIO = setWSIO;
function initDashboard() {
    exports.engine.initDashboard();
}
exports.initDashboard = initDashboard;
function activate() {
    exports.engine.activate();
}
exports.activate = activate;
function deactivate() {
    exports.engine.deactivate();
}
exports.deactivate = deactivate;
//# sourceMappingURL=Engine.js.map