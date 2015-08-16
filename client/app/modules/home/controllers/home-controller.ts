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
                case "drinks" :
                    return new Page("Drinks", "home.drinks.overview.list");
                case "drinks" :
                    return new Page("Users", "home.users.overview.list");
                default:
                    return null;
            }
        }

        //public pages:{ [key: string]: IPage; } = {};
        public pages:Array<IPage> = [];

        public static $inject = ["$log", "$location", "$state", "homeResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService, private homeResource) {
            $log.info("HomeController called with client-url: " + $location.path());

            if (this.homeResource.$has("drinks")) {
                this.pushPage("drinks");
            }
            if (this.homeResource.$has("users")) {
                this.pushPage("users");
            }
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