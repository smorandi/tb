///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class DashboardController {
        private search:string;
        private dashboard:Array<any> = [];
        private filteredItems:any = {categories: []};
        private categories:Array<any> = [];
        private currentFilter:string = "all";
        private currentView:string = "tiles";

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
            this.currentView = this.storage.get(constants.LOCAL_STORAGE.dashboardView) || "tiles";
            this.search = this.storage.get(constants.LOCAL_STORAGE.dashboardSearch) || "";

            this.$scope.$watchCollection(() => dashboardService.dashboard, items => this.updateFilteredLists(items, this.search));
            this.$scope.$watch(() => this.search, search => {
                this.storage.set(constants.LOCAL_STORAGE.dashboardSearch, search);
                this.updateFilteredLists(dashboardService.dashboard, this.search);
            });
        }

        private updateFilteredLists(items:any, search:string) {
            this.filteredItems.all = {name: "All Drinks", items: this.createFilter(items, search)};

            this.filteredItems.categories.length = 0;
            this.filteredItems.categories.push({name: "Cocktails", items: this.createFilter(items, search, "cocktail")});
            this.filteredItems.categories.push({name: "Shots", items: this.createFilter(items, search, "shot")});
            this.filteredItems.categories.push({name: "Beers", items: this.createFilter(items, search, "beer")});
            this.filteredItems.categories.push({name: "Wines", items: this.createFilter(items, search, "wine")});
            this.filteredItems.categories.push({name: "Teas", items: this.createFilter(items, search, "tea")});
            this.filteredItems.categories.push({name: "Coffees", items: this.createFilter(items, search, "coffee")});
            this.filteredItems.categories.push({name: "Soft Drinks", items: this.createFilter(items, search, "soft")});
        }

        private createFilter(items:Array<any>, search:string, category?:string):Array<any> {
            var filteredList = items;

            if (search) {
                filteredList = this.$filter("filter")(filteredList, {name: search}, false);
            }

            if (category) {
                filteredList = this.$filter("filter")(filteredList, {category: category}, true);
            }

            filteredList = this.$filter("orderBy")(filteredList, "name");
            return filteredList;
        }

        public setFilter(filter:string) {
            this.currentFilter = filter;
            this.storage.set(constants.LOCAL_STORAGE.dashboardFilter, filter);
        }

        public setView(view:string) {
            this.currentView = view;
            this.storage.set(constants.LOCAL_STORAGE.dashboardView, view);
        }
    }
}