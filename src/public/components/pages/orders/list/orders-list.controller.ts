///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class OrdersListController {
        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            "ordersResource",
            "orderResources"
        ];

        constructor(private $log:ng.ILogService,
                    private $location:ng.ILocationService,
                    private $state:ng.ui.IStateService,
                    private ordersResource,
                    private orderResources) {
            $log.info("OrdersListController called with client-url: " + $location.path());
        }

        public showDetails(orderItem:any):void {
            this.$state.go(constants.STATES.orders.details, {id: orderItem.id});
        }
    }
}
