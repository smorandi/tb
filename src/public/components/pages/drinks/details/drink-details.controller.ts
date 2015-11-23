///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class DrinkDetailsController {
        public edit:boolean = true;
        private drinkForm:ng.IFormController;
        private drink = new models.DrinkProperties();

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            "drinkResource",
            injections.services.loggerService];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService,
                    private utilsService:services.UtilsService, private drinkResource, private logger:services.LoggerService
        ) {
            $log.info("DrinkDetailsController called with client-url: " + $location.path());

            //this.drink = drinkResource;
            this.setDrinkResource(drinkResource);
        }

        public setDrinkResource(resource:any):void {
            this.drinkResource = resource;
            _.assign(this.drink, _.pick(this.drinkResource, _.keys(this.drink)));
        }

        public canDelete():void {
            return this.drinkResource ? this.drinkResource.$has("delete") : false;
        }

        public canEdit():void {
            return this.drinkResource ? this.drinkResource.$has("update") : false;
        }

        public deleteDrink(event:Event):void {
            if (this.utilsService.showPopup("Really delete this?")) {
                this.drinkResource.$del("delete").then(res => this.$state.go(constants.STATES.drinks, null, {reload : true}));
            }
            event.stopPropagation();
        }

        public editDrink() {
            this.$state.go(".editDrink");
        }
    }
}
