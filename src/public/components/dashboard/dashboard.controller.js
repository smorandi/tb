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
            this.currentFilter = "all";
            this.categories = [];
            this.logger.info("DashboardController called");
            this.dashboard = dashboardService.dashboard;
            this.currentFilter = this.storage.get(constants.LOCAL_STORAGE.dashboardFilter) || "all";
            this.search = this.storage.get(constants.LOCAL_STORAGE.dashboardSearch) || "";
            this.$scope.$watchCollection(function () { return dashboardService.dashboard; }, function (items) { return _this.updateCategories(items); });
            this.$scope.$watch(function () { return _this.search; }, function (search) { return _this.storage.set(constants.LOCAL_STORAGE.dashboardSearch, search); });
        }
        DashboardController.prototype.updateCategories = function (items) {
            this.categories.length = 0;
            this.categories.push({ name: "Cocktails", items: this.createFilter(items, "cocktail") });
            this.categories.push({ name: "Shots", items: this.createFilter(items, "shot") });
            this.categories.push({ name: "Beers", items: this.createFilter(items, "beer") });
            this.categories.push({ name: "Wines", items: this.createFilter(items, "wine") });
            this.categories.push({ name: "Teas", items: this.createFilter(items, "tea") });
            this.categories.push({ name: "Coffees", items: this.createFilter(items, "coffee") });
            this.categories.push({ name: "Soft Drinks", items: this.createFilter(items, "soft") });
        };
        DashboardController.prototype.createFilter = function (items, category) {
            var filteredList = this.$filter("filter")(items, { category: category }, true);
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