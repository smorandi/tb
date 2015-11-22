///<reference path="../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var SystemController = (function () {
        function SystemController(logger, $state, systemResource) {
            this.logger = logger;
            this.$state = $state;
            this.systemResource = systemResource;
            this.status = "";
            this.isRunning = false;
            this.system = new models.SystemProperties();
            this.isEdit = false;
            this.logger.info("SystemController created");
            this.setSystemResource(systemResource);
        }
        SystemController.prototype.setSystemResource = function (resource) {
            this.systemResource = resource;
            _.assign(this.system, _.pick(this.systemResource, _.keys(this.system)));
            this.isRunning = this.systemResource.status === "running";
            this.status = this.isRunning ? "engine.status.running" : "engine.status.idle";
        };
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
                _this.setSystemResource(res);
                _this.logger.info("Re-Initialized", null, enums.LogOptions.toast);
            }).catch(function (err) {
                _this.logger.error("Re-Initialization failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        };
        SystemController.prototype.startEngine = function () {
            var _this = this;
            this.systemResource.$put("startEngine", {}, {}).then(function (res) {
                _this.setSystemResource(res);
                _this.logger.info("Engine started", null, enums.LogOptions.toast);
            }).catch(function (err) {
                _this.logger.error("Engine start failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        };
        SystemController.prototype.stopEngine = function () {
            var _this = this;
            this.systemResource.$put("stopEngine", {}, {}).then(function (res) {
                _this.setSystemResource(res);
                _this.logger.info("Engine stopped", null, enums.LogOptions.toast);
            }).catch(function (err) {
                _this.logger.error("Engine stop failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        };
        SystemController.prototype.edit = function () {
            this.isEdit = true;
        };
        SystemController.prototype.cancel = function () {
            this.$state.reload();
        };
        SystemController.prototype.save = function () {
            var _this = this;
            if (this.systemForm.$valid && this.isEdit) {
                this.systemResource.$put("update", {}, this.system)
                    .then(function (res) {
                    _this.$state.reload()
                        .then(function (res) {
                        _this.logger.info("System Changed", "", enums.LogOptions.toast);
                    })
                        .catch(function (err) {
                        _this.logger.error("Sign-Up Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                    });
                })
                    .catch(function (err) {
                    _this.logger.error("Change Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                });
            }
        };
        SystemController.$inject = [injections.services.loggerService, injections.uiRouter.$stateService, "systemResource"];
        return SystemController;
    })();
    controllers.SystemController = SystemController;
})(controllers || (controllers = {}));
//# sourceMappingURL=system.controller.js.map