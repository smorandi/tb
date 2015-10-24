///<reference path="../../all.references.ts" />
var home;
(function (home) {
    "use strict";
    var DashboardController = (function () {
        function DashboardController($log, $location, $scope, $state, $stateParams, socketService, dashboardService) {
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.socketService = socketService;
            this.dashboardService = dashboardService;
            this.db = [];
            $log.info("DashboardController called with client-url: '" + $location.path() + "'");
            this.db = dashboardService.getDashboard();
            //var y = $scope["dashboard"];
            //$scope.$watch("dashboard", change => {
            //    this.dashboard = change;
            //});
            //socketService.on("dashboard", data => {
            //    $log.info("DashboardController --> " + JSON.stringify(data));
            //    this.dashboard = data;
            //});
        }
        DashboardController.$inject = ["$log", "$location", "$scope", "$state", "$stateParams", "socketService", "dashboardService"];
        return DashboardController;
    })();
    angular.module("dashboard").controller("DashboardController", DashboardController);
})(home || (home = {}));
//# sourceMappingURL=dashboard.controller.js.map