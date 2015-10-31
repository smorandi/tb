///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class DashboardController {
        public dashboard = [];
        public query:string;

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.services.dashboardService,
            injections.services.loggerService
        ];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private dashboardService:services.DashboardService, private LoggerService:services.LoggerService) {
            $log.info("DashboardController called with client-url: '" + $location.path() + "'");
            LoggerService.ToastInfo("greetings from John Doe","Welcome");

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
    }
}