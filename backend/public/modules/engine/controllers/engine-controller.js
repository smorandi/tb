///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />
var engine;
(function (engine) {
    "use strict";
    var EngineController = (function () {
        function EngineController($log, $location, $scope, $state, $stateParams, apiService, utilsService, socketService, engineResource) {
            var _this = this;
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.apiService = apiService;
            this.utilsService = utilsService;
            this.socketService = socketService;
            this.engineResource = engineResource;
            $log.info("EngineController called with client-url: " + $location.path());
            socketService.on("newPrices", function (data) {
                console.log("EngineController --> " + JSON.stringify(data));
                _this.drinks = data;
            });
        }
        EngineController.prototype.activateEngine = function () {
            var _this = this;
            this.engineResource.$put("activate", {}, {}).then(function (res) {
                _this.engineResource = res;
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        EngineController.prototype.deactivateEngine = function () {
            var _this = this;
            this.engineResource.$put("deactivate", {}, {}).then(function (res) {
                _this.engineResource = res;
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        EngineController.$inject = ["$log", "$location", "$scope", "$state", "$stateParams", "apiService", "utilsService", "socketService", "engineResource"];
        return EngineController;
    })();
    angular.module("engine").controller("EngineController", EngineController);
})(engine || (engine = {}));
//# sourceMappingURL=engine-controller.js.map