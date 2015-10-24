///<reference path="../../../all.references.ts" />

module drinks {
    "use strict";

    class DrinkEditController {
        drink:any;

        public static $inject = ["$log", "$location", "$state", "utilsService", "drinkResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService, private utilsService:services.UtilsService, private drinkResource) {
            $log.info("DrinkEditController called with client-url: " + $location.path());

            //as we cannot directly edit the read-only instance of resource, we clone it...
            this.drink = JSON.parse(JSON.stringify(drinkResource));
        }

        public updateDrink():void {
            this.drinkResource.$put("update", {}, this.drink).then(res => {
                this.utilsService.alert("The drink has been updated!");
                this.$state.go("^", {}, {reload: true});
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }
    }

    angular.module("drinks").controller("DrinkEditController", DrinkEditController);
}