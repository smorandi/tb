/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var logger = require("../config/logger");
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
        logger.info("engine activated...");
        this.status = "activated";
        this.lastChangeDate = new Date();
        timer = setInterval(function () { return _this.loop(); }, this.updateInterval);
    };
    Engine.prototype.deactivate = function () {
        logger.info("engine deactivated...");
        clearInterval(timer);
        this.status = "deactivated";
        this.lastChangeDate = new Date();
    };
    Engine.prototype.initDashboard = function () {
        logger.info("initializing dashboard...");
        repository.find({}, function (err, docs) {
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
        logger.info("recalculating dashboard...");
        repository.find({}, function (err, docs) {
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
        logger.info("emitting dashboard...");
        wsIO.sockets.emit("dashboard", exports.dashboard);
    };
    Engine.prototype.loop = function () {
        this.recalculateDashboard();
        this.emitDashboard();
    };
    return Engine;
})();
var repository;
var wsIO;
var timer;
exports.engine = new Engine();
exports.dashboard = [];
function setWSIO(io) {
    wsIO = io;
}
exports.setWSIO = setWSIO;
function setRepository(repo) {
    repository = repo;
    initDashboard();
}
exports.setRepository = setRepository;
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
//# sourceMappingURL=engine.js.map