///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class DrinkCreateController {
        public drink = new models.DrinkProperties();
        public edit:boolean = false;
        private drinkForm:ng.IFormController;

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            "drinksResource",
            injections.services.loggerService,
        ];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService,
                     private drinksResource,  private logger:services.LoggerService
        ) {
            $log.info("DrinkEditController called with client-url: " + $location.path());
        }

        public createDrink():void {
            if (this.drinkForm.$valid) {
                this.drinksResource.$post("create", {}, this.drink).then(res => {
                    this.$state.go("root.home.drinks.overview.list", {}, {reload: true})
                        .then(res=> {
                            this.logger.info("The drink has been created!", "", enums.LogOptions.toast);
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

        public cancel():void{
            this.$state.go("^", {}, {reload: true});
        }
    }
}