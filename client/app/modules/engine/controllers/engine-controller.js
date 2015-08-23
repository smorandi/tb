///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />
var engine;
(function (engine) {
    "use strict";
    var EngineController = (function () {
        function EngineController($log, $location, $scope, $state, $stateParams, apiService, utilsService, socketService) {
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.apiService = apiService;
            this.utilsService = utilsService;
            this.socketService = socketService;
            $log.info("EngineController called with client-url: " + $location.path());
            socketService.on("newPrices", function (data) {
                console.log("EngineController --> " + JSON.stringify(data));
            });
        }
        EngineController.$inject = ["$log", "$location", "$scope", "$state", "$stateParams", "apiService", "utilsService", "socketService"];
        return EngineController;
    })();
    angular.module("engine").controller("EngineController", EngineController);
})(engine || (engine = {}));
//# sourceMappingURL=engine-controller.js.map