///<reference path="../../../../typings/tsd.d.ts" />

module core.controllers {
    "use strict";

    class CoreController {
        public homeResource:any;
        public pages:Array<any> = [];

        public static $inject = ["$log", "$scope", "$state", "popupService", "halClient"];

        constructor(private $log:ng.ILogService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private popupService, private halClient) {
            $log.info("AppController called");

            halClient.$get("http://localhost:3000").then(res => {
                this.homeResource = res;

                if (res.$has("drinks")) {
                    this.pages.push({rel: "Drinks", state: "drinks", url: res.$href("drinks")});
                    $log.info("pushing " + res.$href("drinks"));
                }
                if (res.$has("users")) {
                    this.pages.push({rel: "Users", state: "users", url: res.$href("users")});
                    $log.info("pushing " + res.$href("users"));
                }
            });
        }

        public go(page:any):void {
            this.$state.go(page.state, {url: page.url});
        }
    }

    angular.module("core").controller("CoreController", CoreController);
}