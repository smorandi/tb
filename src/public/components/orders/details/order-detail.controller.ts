///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class OrderDetailsController {
        public order:any;

        static $inject = [injections.angular.$log, injections.angular.$location, injections.uiRouter.$stateService, injections.services.utilsService, "orderResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService, private utilsService:services.UtilsService, private orderResource) {
            $log.info("OrderDetailsController called with client-url: " + $location.path());
            this.order = orderResource;
        }


    }
}
