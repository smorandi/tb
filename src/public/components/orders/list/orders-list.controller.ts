///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class OrdersListController {
        public query:string;

        static $inject = [injections.angular.$log, injections.angular.$location, injections.uiRouter.$stateService, injections.services.utilsService, "ordersResource", "orderResources"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService, private utilsService:services.UtilsService, private ordersResource, private orderResources) {
            $log.info("OrdersListController called with client-url: " + $location.path());
        }


    }
}
