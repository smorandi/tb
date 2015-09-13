///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../dashboard-module.ts" />
///<reference path="../../home/home-module.ts" />

module home {
    "use strict";

    class DashboardController {
        public static $inject = ["$log", "$location", "$scope", "$state", "$stateParams", "apiService", "utilsService", "socketService", "dashboard"];
        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private apiService:home.ApiService, private utilsService:home.UtilsService, private socketService:any, private dashboard) {
            $log.info("DashboardController called with client-url: '" + $location.path() + "'");

            socketService.on("dashboard", data => {
                $log.info("DashboardController --> " + JSON.stringify(data));
                this.dashboard = data;
            });
        }
    }

    angular.module("dashboard").controller("DashboardController", DashboardController);
}