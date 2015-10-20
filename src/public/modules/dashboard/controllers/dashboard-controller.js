///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../dashboard-module.ts" />
///<reference path="../../root/root-module.ts" />
var home;
(function (home) {
    "use strict";
    var DashboardController = (function () {
        function DashboardController($log, $location, $scope, $state, $stateParams, apiService, utilsService, socketService, dashboard) {
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.apiService = apiService;
            this.utilsService = utilsService;
            this.socketService = socketService;
            this.dashboard = dashboard;
            this.db = [];
            $log.info("DashboardController called with client-url: '" + $location.path() + "'");
            this.db = dashboard;
            //var y = $scope["dashboard"];
            //$scope.$watch("dashboard", change => {
            //    this.dashboard = change;
            //});
            //socketService.on("dashboard", data => {
            //    $log.info("DashboardController --> " + JSON.stringify(data));
            //    this.dashboard = data;
            //});
        }
        DashboardController.$inject = ["$log", "$location", "$scope", "$state", "$stateParams", "apiService", "utilsService", "socketService", "dashboard"];
        return DashboardController;
    })();
    angular.module("dashboard").controller("DashboardController", DashboardController);
})(home || (home = {}));
//# sourceMappingURL=dashboard-controller.js.map