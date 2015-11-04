///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class DashboardController {
        public dashboard = [];
        public query:string;
        public currentFilter:string = "all";

        static $inject = [
            injections.services.loggerService,
            injections.services.dashboardService,
            "filter"
        ];

        constructor(private logger:services.LoggerService,
                    private dashboardService:services.DashboardService,
                    private filter:string) {
            this.logger.info("DashboardController called", filter);
            this.dashboard = dashboardService.dashboard;
            this.currentFilter = filter;
        }

        public showDetails(item:any) {
            this.logger.info(item.id, item.name, enums.LogOptions.toast_only);
        }

        public getImageForItem(item:any) {
            switch (item.category) {
                case "beer":
                    return "assets/images/drinks/beer.png";
                case "cocktail":
                    return "assets/images/drinks/cocktail.png";
                case "wine":
                    return "assets/images/drinks/wine.png";
                case "coffee":
                    return "assets/images/drinks/coffee.png";
            }
        }

        public setFilter(filter:string) {
            this.currentFilter = filter;
        }
    }
}