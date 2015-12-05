///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class OrderDetailsController {
        static $inject = [
            injections.services.loggerService,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            "orderResource"
        ];

        constructor(private logger:services.LoggerService,
                    private $location:ng.ILocationService,
                    private $state:ng.ui.IStateService,
                    private orderResource) {

            this.logger.info("OrderDetailsController called with client-url: " + $location.path());
        }

        public goBack():void {
            this.$state.go("^");
        }
    }
}