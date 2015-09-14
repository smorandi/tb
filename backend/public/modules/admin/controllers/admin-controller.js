///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />
"use strict";
var engine;
(function (engine) {
    var AdminController = (function () {
        function AdminController($log, $location, $scope, $state, $stateParams, apiService, utilsService, adminResource) {
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.apiService = apiService;
            this.utilsService = utilsService;
            this.adminResource = adminResource;
            $log.info("AdminController called with client-url: " + $location.path());
        }
        AdminController.prototype.replay = function () {
            var _this = this;
            this.adminResource.$post("replay", {}, {}).then(function (res) {
                _this.adminResource = res;
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        AdminController.prototype.activateEngine = function () {
            var _this = this;
            this.adminResource.$put("activate", {}, {}).then(function (res) {
                _this.adminResource = res;
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        AdminController.prototype.deactivateEngine = function () {
            var _this = this;
            this.adminResource.$put("deactivate", {}, {}).then(function (res) {
                _this.adminResource = res;
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        AdminController.$inject = ["$log", "$location", "$scope", "$state", "$stateParams", "apiService", "utilsService", "adminResource"];
        return AdminController;
    })();
    angular.module("admin").controller("AdminController", AdminController);
})(engine || (engine = {}));
//# sourceMappingURL=admin-controller.js.map