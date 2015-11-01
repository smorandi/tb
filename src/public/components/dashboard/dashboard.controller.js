///<reference path="../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DashboardController = (function () {
        function DashboardController(logger, dashboardService) {
            this.logger = logger;
            this.dashboardService = dashboardService;
            this.dashboard = [];
            logger.info("DashboardController called");
            this.dashboard = dashboardService.dashboard;
        }
        DashboardController.prototype.showDetails = function () {
            this.logger.info("details", "details", enums.LogOptions.toast_only);
        };
        DashboardController.$inject = [
            injections.services.loggerService,
            injections.services.dashboardService
        ];
        return DashboardController;
    })();
    controllers.DashboardController = DashboardController;
})(controllers || (controllers = {}));
//# sourceMappingURL=dashboard.controller.js.map