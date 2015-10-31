///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class BasketController {
        static $inject = [injections.angular.$log, injections.angular.$location, "basketResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private basketResource) {
            $log.info("ProfileController called with client-url: '" + $location.path() + "'");
        }
    }
}