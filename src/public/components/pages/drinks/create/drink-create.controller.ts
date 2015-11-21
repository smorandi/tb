///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class DrinkCreateController {
        drink:any;

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            "drinksResource",
            injections.services.loggerService,
        ];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService,
                    private utilsService:services.UtilsService, private drinksResource,  private logger:services.LoggerService
        ) {
            $log.info("DrinkEditController called with client-url: " + $location.path());
        }

        createDrink():void {
            this.drinksResource.$post("create", {}, this.drink).then(res => {
                this.logger.error("The drink has been updated!", "", enums.LogOptions.toast);
                //this.utilsService.alert("The drink has been updated!");
                this.$state.go(".list", {}, {relative: this.$state.get("root.home.drinks.overview"), reload: true});
            }).catch(err => {
                try {
                    this.logger.error(err.data.name, err.data.message, enums.LogOptions.toast);
                } catch(e){
                    this.logger.error("Error", err, enums.LogOptions.toast);
                }

            });
        }
    }
}