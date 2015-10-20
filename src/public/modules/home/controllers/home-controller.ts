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
        public static $inject = ["$log", "$location", "$scope", "$state", "socketService", "homeResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private socketService, private homeResource) {
            $log.info("HomeController called with client-url: '" + $location.path() + "'");
        }

        public go(page:IPage):void {
            this.$state.go(page.state);
        }
    }

    angular.module("home").controller("HomeController", HomeController);
}