///<reference path="../../../all.references.ts" />

module drinks {
    "use strict";

    class DrinkCreateController {
        drink:any;

        public static $inject = ["$log", "$location", "$state", "utilsService", "drinksResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService, private utilsService:services.UtilsService, private drinksResource) {
            $log.info("DrinkEditController called with client-url: " + $location.path());
        }

        createDrink():void {
            this.drinksResource.$post("create", {}, this.drink).then(res => {
                this.utilsService.alert("The drink has been updated!");
                this.$state.go(".list", {}, {relative: this.$state.get("root.home.drinks.overview"), reload: true});
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }
    }

    angular.module("drinks").controller("DrinkCreateController", DrinkCreateController);
}