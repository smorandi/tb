///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../root-module.ts" />

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

    class RootController {
        public static getPageForRel(rel:string):IPage {
            switch (rel) {
                case "home" :
                    return new Page("Home", "root.home.dashboard");
                case "dashboard" :
                    return new Page("Dashboard", "root.dashboard");
                case "registerCustomer" :
                    return new Page("RegisterCustomer", "root.registerCustomer");
                default:
                    return null;
            }
        }

        //public pages:{ [key: string]: IPage; } = {};
        public pages:Array<IPage> = [];
        //public dashboard = [];

        public static $inject = ["$log", "$location", "$scope", "$state", "socketService", "rootResource", "dashboard"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private socketService, private rootResource, private dashboard) {
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

        public pushPage(rel:string):IPage {
            var page = RootController.getPageForRel(rel);
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
            try {
                this.$state.go(page.state);
            }
            catch(err) {
                this.$log.error(err);
            }
        }
    }

    angular.module("root").controller("RootController", RootController);
}