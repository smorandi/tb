///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class DashboardController {
        public search:string;
        public dashboard:Array<any> = [];
        public currentFilter:string = "all";
        public categories:Array<any> = [];

        static $inject = [
            injections.services.loggerService,
            injections.services.dashboardService,
            injections.angular.$filter,
            injections.angular.$scope,
            injections.services.localStorageService
        ];

        constructor(private logger:services.LoggerService,
                    private dashboardService:services.DashboardService,
                    private $filter:ng.IFilterService,
                    private $scope:ng.IScope,
                    private storage:services.LocalStorageService) {
            this.logger.info("DashboardController called");
            this.dashboard = dashboardService.dashboard;

            this.currentFilter = this.storage.get(constants.LOCAL_STORAGE.dashboardFilter) || "all";
            this.search = this.storage.get(constants.LOCAL_STORAGE.dashboardSearch) || "";

            this.$scope.$watchCollection(() => dashboardService.dashboard, items => this.updateCategories(items));
            this.$scope.$watch(() => this.search, search => this.storage.set(constants.LOCAL_STORAGE.dashboardSearch, search));
        }

        private updateCategories(items:any) {
            this.categories.length = 0;
            this.categories.push({name: "Cocktails", items: this.createFilter(items, "cocktail")});
            this.categories.push({name: "Shots", items: this.createFilter(items, "shot")});
            this.categories.push({name: "Beers", items: this.createFilter(items, "beer")});
            this.categories.push({name: "Wines", items: this.createFilter(items, "wine")});
            this.categories.push({name: "Teas", items: this.createFilter(items, "tea")});
            this.categories.push({name: "Coffees", items: this.createFilter(items, "coffee")});
            this.categories.push({name: "Soft Drinks", items: this.createFilter(items, "soft")});
        }

        private createFilter(items:Array<any>, category:string):Array<any> {
            var filteredList = this.$filter("filter")(items, {category: category}, true);
            filteredList = this.$filter("orderBy")(filteredList, "name");
            return filteredList;
        }

        public showDetails(item:any) {
            this.logger.info(item.id, item.name, enums.LogOptions.toast_only);
        }

        public getImageForItem(item:any) {
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
        }

        public setFilter(filter:string) {
            this.currentFilter = filter;
            this.storage.set(constants.LOCAL_STORAGE.dashboardFilter, filter);
        }
    }
}