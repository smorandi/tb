///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../core-module.ts" />

module core {
    "use strict";

    class CoreController {
        public homeResource:any;
        public pages:Array<any> = [];

        public static $inject = ["$log", "$location", "$scope", "$state", "apiService", "utilsService"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private apiService:ApiService, private utilsService:UtilsService) {
            $log.info("CoreController called");

            this.apiService.$load().then(res => {
                this.homeResource = res;

                if (res.$has("drinks")) {
                    this.pages.push({rel: "Drinks", state: "home.drinks.list", url: res.$href("drinks")});
                    $log.info("pushing " + res.$href("drinks"));
                }
                if (res.$has("users")) {
                    this.pages.push({rel: "Users", state: "home.users.list", url: res.$href("users")});
                    $log.info("pushing " + res.$href("users"));
                }
            });
        }

        public go(page:any):void {
            //this.$location.path("/drinks");
            //var url = this.utilsService.removeHostPartFromUrl(page.url);
            this.$state.go("home.drinks.list", {href: page.url}, {reload: true});
            //this.$state.go(page.state, {href: page.url}, {reload: false});
        }
    }

    angular.module("core").controller("CoreController", CoreController);
}