///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class OrdersListController {
        public query:string;

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            "ordersResource",
            "orderResources",
            injections.services.footerService,
        ];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private ordersResource, private orderResources, private footer:services.FooterService) {
            $log.info("OrdersListController called with client-url: " + $location.path());

            footer.setFooterItems([]);
            footer.setCallbackFooterItem(null);
            footer.setShowFooter(false);

        }

    }
}
