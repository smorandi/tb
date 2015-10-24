///<reference path="../../all.references.ts" />

module home {
    "use strict";

    class DashboardController {
        public db = [];

        public static $inject = ["$log", "$location", "$scope", "$state", "$stateParams", "socketService", "dashboardService"];
        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private socketService:services.SocketService, private dashboardService:services.DashboardService) {
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
    }

    angular.module("dashboard").controller("DashboardController", DashboardController);
}