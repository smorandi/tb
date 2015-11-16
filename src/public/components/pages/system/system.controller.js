///<reference path="../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var SystemController = (function () {
        function SystemController(logger, $location, systemResource) {
            this.logger = logger;
            this.$location = $location;
            this.systemResource = systemResource;
            this.logger.info("SystemController called with client-url: " + $location.path());
        }
        SystemController.prototype.replay = function () {
            var _this = this;
            this.systemResource.$post("replay", {}, {}).then(function (res) {
                _this.logger.info("Events replayed", null, enums.LogOptions.toast);
            }).catch(function (err) {
                _this.logger.error("Replay failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        };
        SystemController.prototype.reinitialize = function () {
            var _this = this;
            this.systemResource.$post("reInitialize", {}, {}).then(function (res) {
                _this.systemResource = res;
                _this.logger.info("Re-Initialized", null, enums.LogOptions.toast);
            }).catch(function (err) {
                _this.logger.error("Re-Initialization failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        };
        SystemController.prototype.startEngine = function () {
            var _this = this;
            this.systemResource.$put("startEngine", {}, {}).then(function (res) {
                _this.systemResource = res;
                _this.logger.info("Engine started", null, enums.LogOptions.toast);
            }).catch(function (err) {
                _this.logger.error("Engine start failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        };
        SystemController.prototype.stopEngine = function () {
            var _this = this;
            this.systemResource.$put("stopEngine", {}, {}).then(function (res) {
                _this.systemResource = res;
                _this.logger.info("Engine stopped", null, enums.LogOptions.toast);
            }).catch(function (err) {
                _this.logger.error("Engine stop failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        };
        SystemController.$inject = [injections.services.loggerService, injections.angular.$location, "systemResource"];
        return SystemController;
    })();
    controllers.SystemController = SystemController;
})(controllers || (controllers = {}));
//# sourceMappingURL=system.controller.js.map