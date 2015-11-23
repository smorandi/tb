///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class DrinkEditController {
        drink:any;
        public edit:boolean = false;
        private drinkForm:ng.IFormController;

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            "drinkResource",
            injections.services.loggerService,
        ];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService,
                    private drinkResource, private logger:services.LoggerService
        ) {
            $log.info("DrinkEditController called with client-url: " + $location.path());

            //as we cannot directly edit the read-only instance of resource, we clone it...
            this.drink = JSON.parse(JSON.stringify(drinkResource));
        }

        public save():void {
            if (this.drinkForm.$valid) {
                this.drinkResource.$put("update", {}, this.drink).then(res => {
                    this.$state.go("^", {}, {reload: true})
                        .then(res=> {
                            this.logger.info("The drink has been updated!", null, enums.LogOptions.toast);
                        });
                }).catch(err => {
                    try {
                        this.logger.error(err.data.name, err.data.message, enums.LogOptions.toast);
                    } catch (e) {
                        this.logger.error("Error", err, enums.LogOptions.toast);
                    }
                });
            }
        }

        public cancel():void {
            this.$state.go("^", {}, {reload: true});
        }
    }
}