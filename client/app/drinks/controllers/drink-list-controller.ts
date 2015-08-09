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
                if(drinksResource.$has("collection")) {
                    return drinksResource.$get("collection");
                }
            }).then(collection => {
                this.drinkResources = collection;
            });
        }

        public canCreateNewDrink():boolean {
            return this.drinksResource === undefined ? false : this.drinksResource.$has("create");
        }

        public canDeleteAllDrinks():boolean {
            return this.drinksResource.$has("delete");
        }

        public canDelete(drink:any):boolean {
            return drink.$has("delete");
        }

        public deleteDrink(drink:any, event:Event):void {
            if (this.popupService.showPopup('Really delete this?')) {
                drink.$del("delete").then(x => this.$state.reload());
            }
            event.stopPropagation();
        }

        public deleteAllDrinks(event:Event):void {
            if (this.popupService.showPopup('Really delete all drinks?')) {
                this.drinksResource.$del("delete").then(res => this.$state.go("drinks", {}, {reload: true}));
            }
            event.stopPropagation();
        }

        public createNewDrink():void {
            this.$state.go("newDrink", {
                url: this.drinksResource.$href("create"),
                resource: this.drinksResource
            })
        }

        public viewDrink(drink:any):void {
            this.$state.go("drinks.viewDrink", {
                url: drink.$href("self"),
                resource: drink
            })
        }
    }

    angular.module("drinks").controller("DrinkListController", DrinkListController);
}
