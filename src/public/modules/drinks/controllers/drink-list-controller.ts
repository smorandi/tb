///<reference path="../../../all.references.ts" />

module drinks {
    "use strict";

    class DrinkListController {
        public query:string;

        public static $inject = ["$log", "$location", "$scope", "$state", "$stateParams", "utilsService", "drinksResource", "drinkResources"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private utilsService:services.UtilsService, private drinksResource, private drinkResources) {
            $log.info("DrinkListController called with client-url: " + $location.path());
        }

        public canCreateNewDrink():boolean {
            return this.drinksResource === undefined ? false : this.drinksResource.$has("create");
        }

        public canDeleteAllDrinks():boolean {
            return this.drinksResource === undefined ? false : this.drinksResource.$has("delete");
        }

        public canDelete(drink:any):boolean {
            return drink.$has("delete");
        }

        public deleteDrink(drink:any, event:Event):void {
            if (this.utilsService.showPopup('Really delete this?')) {
                drink.$del("delete").then(x => this.$state.reload());
            }
            event.stopPropagation();
        }

        public deleteAllDrinks(event:Event):void {
            if (this.canDeleteAllDrinks()) {
                if (this.utilsService.showPopup('Really delete all drinks?')) {
                    this.drinksResource.$del("delete").then(res => this.$state.go("drinks", {}, {reload: true}));
                }
                event.stopPropagation();
            }
        }

        public createNewDrink():void {
            this.$state.go("root.home.drinks.newDrink");
        }

        public viewDrink(drink:any):void {
            this.$state.go("root.home.drinks.overview.list.detail", {id: drink.id});
        }
    }

    angular.module("drinks").controller("DrinkListController", DrinkListController);
}
