///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class ApiService {
        static $inject = [
            injections.services.loggerService,
            injections.extServices.halService,
            injections.angular.$location
        ];

        constructor(private logger:services.LoggerService, private hal:any, private $location:ng.ILocationService) {
            this.logger.debug("ApiService created")
        }

        public $load():ng.IPromise<any> {
            var host = this.$location.protocol() + '://' + this.$location.host() + ':' + this.$location.port();
            var root = host + constants.API;
            this.logger.debug("loading api root resource @" + root);
            return this.hal.$get(root);
        }
    }
}