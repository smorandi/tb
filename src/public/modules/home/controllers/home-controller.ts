///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../home-module.ts" />

module home {
    "use strict";

    interface IPage {
        name:string;
        state:string;
    }

    class Page implements IPage {
        constructor(public name:string, public state:string) {
        }
    }

    class HomeController {
        public static getPageForRel(rel:string):IPage {
            switch (rel) {
                case "admin" :
                    return new Page("Admin", "home.admin");
                case "drinks" :
                    return new Page("Drinks", "home.drinks.overview.list");
                case "customers" :
                    return new Page("Customers", "home.customers.overview.list");
                default:
                    return null;
            }
        }

        //public pages:{ [key: string]: IPage; } = {};
        public pages:Array<IPage> = [];
        //public dashboard = [];

        public static $inject = ["$log", "$location", "$scope", "$state", "socketService", "homeResource", "dashboard"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private socketService, private homeResource, private dashboard) {
            $log.info("HomeController called with client-url: '" + $location.path() + "'");

            //$scope["dashboard"] = ["der fisch"];

            if (this.homeResource.$has("admin")) {
                this.pushPage("admin");
            }
            if (this.homeResource.$has("drinks")) {
                this.pushPage("drinks");
            }
            if (this.homeResource.$has("customers")) {
                this.pushPage("customers");
            }
            //if (this.homeResource.$has("dashboard")) {
            //    this.homeResource.$get("dashboard").then(res => {
            //        $log.info("dashboard resolved...");
            //        $scope["dashboard"] = res;
            //    });
            //}

            //socketService.on("dashboard", data => {
            //    $log.info("HomeController --> " + JSON.stringify(data));
            //    $scope["dashboard"] = data;
            //});
        }

        public pushPage(rel:string):IPage {
            var page = HomeController.getPageForRel(rel);
            if (page === null) {
                this.$log.warn("no page for: " + rel);
            }
            else {
                this.$log.warn("pushing page: " + rel + " -> " + page.name + "@" + page.state);
                this.pages.push(page);
            }

            return page;
        }

        public go(page:IPage):void {
            this.$state.go(page.state);
        }
    }

    angular.module("home").controller("HomeController", HomeController);
}