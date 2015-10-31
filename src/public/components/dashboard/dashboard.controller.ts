///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class DashboardController {
        public dashboard = [];
        public query:string;

        static $inject = [
            injections.services.loggerService,
            injections.services.dashboardService
        ];

        constructor(private logger:services.LoggerService,
                    private dashboardService:services.DashboardService) {
            logger.info("DashboardController called");
            this.dashboard = dashboardService.dashboard;
        }
    }
}