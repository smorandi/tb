///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class DrinkDetailsController {
        public drink:any;

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
            this.drink = drinkResource;
        }

        public canDelete():void {
            return this.drink ? this.drink.$has("delete") : false;
        }

        public canEdit():void {
            return this.drink ? this.drink.$has("update") : false;
        }

        public deleteDrink(event:Event):void {
            if (this.utilsService.showPopup("Really delete this?")) {
                this.drink.$del("delete").then(res => this.$state.go(constants.STATES.drinks, null, {reload : true}));
            }
            event.stopPropagation();
        }

        public editDrink() {
            this.$state.go(".editDrink");
        }
    }
}
