///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../core/core-module.ts" />

module drinks.controllers {
    "use strict";

    class DrinkViewController {
        drink:any;

        public static $inject = ["$log", "$location", "$scope", "$state", "$stateParams", "utilsService", "drinkResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private utilsService:core.UtilsService, private drinkResource) {
            $log.info("DrinkViewController called with client-url: " + $location.path());
            this.drink = drinkResource;
        }

        public canDelete():void {
            return this.drink === undefined ? false : this.drink.$has("delete");
        }

        public canEdit():void {
            return this.drink === undefined ? false : this.drink.$has("update");
        }

        public deleteDrink():void {
            if (this.utilsService.showPopup("Really delete this?")) {
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
