///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class DrinkEditController {
        drink:any;
        public edit:boolean = false;

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            "drinkResource",
            injections.services.loggerService,
        ];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService,
                    private utilsService:services.UtilsService, private drinkResource, private logger:services.LoggerService
        ) {
            $log.info("DrinkEditController called with client-url: " + $location.path());

            //as we cannot directly edit the read-only instance of resource, we clone it...
            this.drink = JSON.parse(JSON.stringify(drinkResource));
        }

        public updateDrink():void {
            this.drinkResource.$put("update", {}, this.drink).then(res => {
                this.logger.error("The drink has been updated!", null, enums.LogOptions.toast_only);
                this.$state.go("^", {}, {reload: true});
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