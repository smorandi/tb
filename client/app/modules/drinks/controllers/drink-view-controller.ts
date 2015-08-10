///<reference path="../../../../typings/tsd.d.ts" />

module drinks.controllers {
    "use strict";

    class DrinkViewController {
        url:any;
        drink:any;

        public static $inject = ["$log", "$location", "$scope", "$state", "$stateParams", "popupService", "halClient"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private popupService, private halClient) {
            $log.info("DrinkViewController called with url: " + $stateParams["url"]);

            this.url = decodeURIComponent($stateParams["url"]);
            halClient.$get(this.url).then(res => this.drink = res);
        }

        public canDelete():void {
            return this.drink === undefined ? false : this.drink.$has("delete");
        }

        public canEdit():void {
            return this.drink === undefined ? false : this.drink.$has("update");
        }

        public deleteDrink():void {
            if (this.popupService.showPopup("Really delete this?")) {
                this.drink.$del("delete").then(res => this.$state.reload());
            }
            event.stopPropagation();
        }

        public editDrink() {
            this.$state.go("editDrink", {url: this.drink.$href("update"), resource: this.drink});
        }
    }

    angular.module("drinks").controller("DrinkViewController", DrinkViewController);
}
