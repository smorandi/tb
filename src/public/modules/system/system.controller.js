///<reference path="../../all.references.ts" />
var modules;
(function (modules) {
    "use strict";
    var SystemController = (function () {
        function SystemController($log, $location, $scope, $state, $stateParams, $document, apiService, utilsService, systemResource) {
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$document = $document;
            this.apiService = apiService;
            this.utilsService = utilsService;
            this.systemResource = systemResource;
            this.alerts = [];
            $log.info("SystemController called with client-url: " + $location.path());
        }
        SystemController.prototype.addAlert = function (msg) {
            this.alerts.push({ type: "success", msg: msg });
        };
        SystemController.prototype.replay = function () {
            var _this = this;
            this.systemResource.$post("replay", {}, {}).then(function (res) {
                //this.$state.reload();
                _this.addAlert("Replay successful");
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        SystemController.prototype.startEngine = function () {
            var _this = this;
            this.systemResource.$put("startEngine", {}, {}).then(function (res) {
                _this.systemResource = res;
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        SystemController.prototype.stopEngine = function () {
            var _this = this;
            this.systemResource.$put("stopEngine", {}, {}).then(function (res) {
                _this.systemResource = res;
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        SystemController.$inject = ["$log", "$location", "$scope", "$state", "$stateParams", "$document", "apiService", "utilsService", "systemResource"];
        return SystemController;
    })();
    angular.module("system").controller("SystemController", SystemController);
})(modules || (modules = {}));
//# sourceMappingURL=system.controller.js.map