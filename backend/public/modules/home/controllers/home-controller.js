///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../home-module.ts" />
var home;
(function (home) {
    "use strict";
    var Page = (function () {
        function Page(name, state) {
            this.name = name;
            this.state = state;
        }
        return Page;
    })();
    var HomeController = (function () {
        function HomeController($log, $location, $scope, $state, socketService, homeResource, dashboard) {
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.socketService = socketService;
            this.homeResource = homeResource;
            this.dashboard = dashboard;
            this.pages = [];
            $log.info("HomeController called with client-url: '" + $location.path() + "'");
            if (this.homeResource.$has("admin")) {
                this.pushPage("admin");
            }
            if (this.homeResource.$has("drinks")) {
                this.pushPage("drinks");
            }
            if (this.homeResource.$has("customers")) {
                this.pushPage("customers");
            }
        }
        HomeController.getPageForRel = function (rel) {
            switch (rel) {
                case "admin":
                    return new Page("Admin", "home.admin");
                case "drinks":
                    return new Page("Drinks", "home.drinks.overview.list");
                case "customers":
                    return new Page("Customers", "home.customers.overview.list");
                default:
                    return null;
            }
        };
        HomeController.prototype.pushPage = function (rel) {
            var page = HomeController.getPageForRel(rel);
            if (page === null) {
                this.$log.warn("no page for: " + rel);
            }
            else {
                this.$log.warn("pushing page: " + rel + " -> " + page.name + "@" + page.state);
                this.pages.push(page);
            }
            return page;
        };
        HomeController.prototype.go = function (page) {
            this.$state.go(page.state);
        };
        HomeController.$inject = ["$log", "$location", "$scope", "$state", "socketService", "homeResource", "dashboard"];
        return HomeController;
    })();
    angular.module("home").controller("HomeController", HomeController);
})(home || (home = {}));
//# sourceMappingURL=home-controller.js.map