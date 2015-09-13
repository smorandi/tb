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
        function HomeController($log, $location, $state, homeResource) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.homeResource = homeResource;
            //public pages:{ [key: string]: IPage; } = {};
            this.pages = [];
            $log.info("HomeController called with client-url: '" + $location.path() + "'");
            if (this.homeResource.$has("engine")) {
                this.pushPage("engine");
            }
            if (this.homeResource.$has("drinks")) {
                this.pushPage("drinks");
            }
            if (this.homeResource.$has("users")) {
                this.pushPage("users");
            }
        }
        HomeController.getPageForRel = function (rel) {
            switch (rel) {
                case "engine":
                    return new Page("Engine", "home.engine");
                case "drinks":
                    return new Page("Drinks", "home.drinks.overview.list");
                case "users":
                    return new Page("Users", "home.users.overview.list");
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
        HomeController.$inject = ["$log", "$location", "$state", "homeResource"];
        return HomeController;
    })();
    angular.module("home").controller("HomeController", HomeController);
})(home || (home = {}));
//# sourceMappingURL=home-controller.js.map