///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class ApiService {
        static $inject = [
            injections.angular.$log,
            injections.extServices.halService,
        ];

        constructor(private $log:ng.ILogService, private hal:any) {
        }

        public $load():ng.IPromise<any> {
            // TODO: maybe get it from the index.html?!?
            return this.$get(constants.api);
        }

        public $get(loc:string):ng.IPromise<any> {
            this.$log.info("GET: " + loc)
            return this.hal.$get(loc);
        }
    }
}