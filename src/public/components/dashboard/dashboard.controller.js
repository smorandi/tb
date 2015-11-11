///<reference path="../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DashboardController = (function () {
        function DashboardController(logger, dashboardService, $filter, $scope, storage) {
            var _this = this;
            this.logger = logger;
            this.dashboardService = dashboardService;
            this.$filter = $filter;
            this.$scope = $scope;
            this.storage = storage;
            this.dashboard = [];
            this.filteredItems = { categories: [] };
            this.currentFilter = "all";
            this.categories = [];
            this.currentView = "tiles";
            this.logger.info("DashboardController called");
            this.dashboard = dashboardService.dashboard;
            this.currentFilter = this.storage.get(constants.LOCAL_STORAGE.dashboardFilter) || "all";
            this.currentView = this.storage.get(constants.LOCAL_STORAGE.dashboardView) || "tiles";
            this.search = this.storage.get(constants.LOCAL_STORAGE.dashboardSearch) || "";
            this.$scope.$watchCollection(function () { return dashboardService.dashboard; }, function (items) { return _this.updateFilteredLists(items, _this.search); });
            this.$scope.$watch(function () { return _this.search; }, function (search) {
                _this.storage.set(constants.LOCAL_STORAGE.dashboardSearch, search);
                _this.updateFilteredLists(dashboardService.dashboard, _this.search);
            });
        }
        DashboardController.prototype.updateFilteredLists = function (items, search) {
            this.filteredItems.all = { name: "All Drinks", items: this.createFilter(items, search) };
            this.filteredItems.categories.length = 0;
            this.filteredItems.categories.push({ name: "Cocktails", items: this.createFilter(items, search, "cocktail") });
            this.filteredItems.categories.push({ name: "Shots", items: this.createFilter(items, search, "shot") });
            this.filteredItems.categories.push({ name: "Beers", items: this.createFilter(items, search, "beer") });
            this.filteredItems.categories.push({ name: "Wines", items: this.createFilter(items, search, "wine") });
            this.filteredItems.categories.push({ name: "Teas", items: this.createFilter(items, search, "tea") });
            this.filteredItems.categories.push({ name: "Coffees", items: this.createFilter(items, search, "coffee") });
            this.filteredItems.categories.push({ name: "Soft Drinks", items: this.createFilter(items, search, "soft") });
        };
        DashboardController.prototype.createFilter = function (items, search, category) {
            var filteredList = items;
            if (search) {
                filteredList = this.$filter("filter")(filteredList, { name: search }, false);
            }
            if (category) {
                filteredList = this.$filter("filter")(filteredList, { category: category }, true);
            }
            filteredList = this.$filter("orderBy")(filteredList, "name");
            return filteredList;
        };
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
            this.storage.set(constants.LOCAL_STORAGE.dashboardFilter, filter);
        };
        DashboardController.prototype.setView = function (view) {
            this.currentView = view;
            this.storage.set(constants.LOCAL_STORAGE.dashboardView, view);
        };
        DashboardController.$inject = [
            injections.services.loggerService,
            injections.services.dashboardService,
            injections.angular.$filter,
            injections.angular.$scope,
            injections.services.localStorageService
        ];
        return DashboardController;
    })();
    controllers.DashboardController = DashboardController;
})(controllers || (controllers = {}));
//# sourceMappingURL=dashboard.controller.js.map