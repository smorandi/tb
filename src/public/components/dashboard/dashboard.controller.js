///<reference path="../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DashboardController = (function () {
        function DashboardController($log, $location, dashboardService) {
            this.$log = $log;
            this.$location = $location;
            this.dashboardService = dashboardService;
            this.dashboard = [];
            $log.info("DashboardController called with client-url: '" + $location.path() + "'");
            this.dashboard = dashboardService.dashboard;
            //var y = $scope["dashboard"];
            //$scope.$watch("dashboard", change => {
            //    this.dashboard = change;
            //});
            //socketService.on("dashboard", data => {
            //    $log.info("DashboardController --> " + JSON.stringify(data));
            //    this.dashboard = data;
            //});
        }
        DashboardController.$inject = [injections.angular.$log, injections.angular.$location, injections.services.dashboardService];
        return DashboardController;
    })();
    controllers.DashboardController = DashboardController;
})(controllers || (controllers = {}));
//# sourceMappingURL=dashboard.controller.js.map