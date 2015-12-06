///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    import IResolvedState = angular.ui.IResolvedState;
    export class DrinkListController {
        public search:string;

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            "drinksResource",
            "drinkResources"
        ];

        constructor(private $log:ng.ILogService,
                    private $location:ng.ILocationService,
                    private $state:ng.ui.IStateService,
                    private utilsService:services.UtilsService,
                    private drinksResource,
                    private drinkResources) {
            $log.info("DrinkListController called with client-url: " + $location.path());
        }

        public canCreateNewDrink():boolean {
            return this.drinksResource === undefined ? false : this.drinksResource.$has("create");
        }

        public canDeleteAllDrinks():boolean {
            return this.drinksResource === undefined ? false : this.drinksResource.$has("delete");
        }

        public getImageForDrink(drink:any):boolean {
            return constants.CATEGORY_IMAGE_MAP[drink.category];
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

        public createNewDrink():void {
            this.$state.go(constants.STATES.drinks.create);
        }

        public viewDrink(drink:any):void {
            this.$state.go(constants.STATES.drinks.details, {id: drink.id});
        }

        public isSelected(drink:any):boolean {
            return this.$state.includes(constants.STATES.drinks.details, {id: drink.id});
        }
    }
}