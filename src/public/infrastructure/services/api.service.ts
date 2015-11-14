///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class ApiService {
        static $inject = [
            injections.angular.$log,
            injections.extServices.halService,
            injections.angular.$location
        ];

        constructor(private $log:ng.ILogService, private hal:any, private $location:ng.ILocationService) {
            $log.log("apiservice")
        }

        public $load():ng.IPromise<any> {
            var host = this.$location.protocol() + '://';// + this.$location.host() + ':' + this.$location.port();
            return this.$get(host + constants.API);
        }

        public $get(loc:string):ng.IPromise<any> {
            this.$log.info("GET: " + loc)
            return this.hal.$get(loc);
        }
    }
}