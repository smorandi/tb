///<reference path="../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DashboardController = (function () {
        function DashboardController(logger, dashboardService, filter) {
            this.logger = logger;
            this.dashboardService = dashboardService;
            this.filter = filter;
            this.dashboard = [];
            this.currentFilter = "all";
            this.logger.info("DashboardController called", filter);
            this.dashboard = dashboardService.dashboard;
            this.currentFilter = filter;
        }
        DashboardController.prototype.showDetails = function (item) {
            this.logger.info(item.id, item.name, enums.LogOptions.toast_only);
        };
        DashboardController.prototype.getImageForItem = function (item) {
            switch (item.category) {
                case "beer":
                    return "assets/images/drinks/beer.jpg";
                case "cocktail":
                    return "assets/images/drinks/cocktail.jpg";
                case "wine":
                    return "assets/images/drinks/wine.jpg";
                case "coffee":
                    return "assets/images/drinks/coffee.jpg";
                case "tea":
                    return "assets/images/drinks/tea.jpg";
                case "shot":
                    return "assets/images/drinks/shot.jpg";
                case "soft":
                    return "assets/images/drinks/soft.jpg";
            }
        };
        DashboardController.prototype.setFilter = function (filter) {
            this.currentFilter = filter;
        };
        DashboardController.$inject = [
            injections.services.loggerService,
            injections.services.dashboardService,
            "filter"
        ];
        return DashboardController;
    })();
    controllers.DashboardController = DashboardController;
})(controllers || (controllers = {}));
//# sourceMappingURL=dashboard.controller.js.map