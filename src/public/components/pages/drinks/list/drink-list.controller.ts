///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class DrinkListController {
        public query:string;
        public activeItem:string;

        static $inject = [injections.angular.$log, injections.angular.$location, injections.uiRouter.$stateService, injections.services.utilsService, "drinksResource", "drinkResources"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService, private utilsService:services.UtilsService, private drinksResource, private drinkResources) {
            $log.info("DrinkListController called with client-url: " + $location.path());
            if($state.params.id){
                this.activeItem = $state.params.id;
            }
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
            this.activeItem = drink.id;
            this.$state.go("root.home.drinks.overview.list.details", {id: drink.id});
        }
    }
}
