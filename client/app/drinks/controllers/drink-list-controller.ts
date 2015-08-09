///<reference path="../../../typings/tsd.d.ts" />

module drinks.controllers {
    "use strict";

    class DrinkListController {
        public drinksResource:any;
        public drinkResources:any;
        public query:string;

        public static $inject = ["$log", "$scope", "$state", "popupService", "halClient"];

        constructor(private $log:ng.ILogService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private popupService, private halClient) {
            //this.drinks = drinkResource.query();

            halClient.$get("http://localhost:3000/drinks").then(drinksResource => {
                this.drinksResource = drinksResource;
                return drinksResource.$get("collection");
            }).then(collection => {
                this.drinkResources = collection;
            });
        }

        deleteDrink(drink:any, event:Event) {
            if (this.popupService.showPopup('Really delete this?')) {
                drink.$del("delete").then(x => this.$state.reload());
            }
            event.stopPropagation();
        }
    }

    angular.module("drinks").controller("DrinkListController", DrinkListController);
}
