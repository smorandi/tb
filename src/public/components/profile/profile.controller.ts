///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class ProfileController {
        static $inject = [injections.angular.$log, injections.angular.$location, "profileResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private profileResource) {
            $log.info("ProfileController called with client-url: '" + $location.path() + "'");
        }
    }
}