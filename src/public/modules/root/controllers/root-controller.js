///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../root-module.ts" />
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
    var RootController = (function () {
        function RootController($log, $location, $scope, $state, socketService, rootResource, dashboard) {
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.socketService = socketService;
            this.rootResource = rootResource;
            this.dashboard = dashboard;
            //public pages:{ [key: string]: IPage; } = {};
            this.pages = [];
            $log.info("RootController called with client-url: '" + $location.path() + "'");
            if (this.rootResource.$has("home")) {
                this.pushPage("home");
            }
            if (this.rootResource.$has("dashboard")) {
                this.pushPage("dashboard");
            }
            if (this.rootResource.$has("registerCustomer")) {
                this.pushPage("registerCustomer");
            }
        }
        RootController.getPageForRel = function (rel) {
            switch (rel) {
                case "home":
                    return new Page("Home", "root.home.dashboard");
                case "dashboard":
                    return new Page("Dashboard", "root.dashboard");
                case "registerCustomer":
                    return new Page("RegisterCustomer", "root.registerCustomer");
                default:
                    return null;
            }
        };
        RootController.prototype.pushPage = function (rel) {
            var page = RootController.getPageForRel(rel);
            if (page === null) {
                this.$log.warn("no page for: " + rel);
            }
            else {
                this.$log.warn("pushing page: " + rel + " -> " + page.name + "@" + page.state);
                this.pages.push(page);
            }
            return page;
        };
        RootController.prototype.go = function (page) {
            try {
                this.$state.go(page.state);
            }
            catch (err) {
                this.$log.error(err);
            }
        };
        //public dashboard = [];
        RootController.$inject = ["$log", "$location", "$scope", "$state", "socketService", "rootResource", "dashboard"];
        return RootController;
    })();
    angular.module("root").controller("RootController", RootController);
})(home || (home = {}));
//# sourceMappingURL=root-controller.js.map