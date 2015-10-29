///<reference path="../../all.references.ts" />

"use strict";

module config {
    export class InterceptorConfig {
        static $inject = [
            injections.angular.$httpProvider
        ];

        constructor($httpProvider:ng.IHttpProvider) {
            $httpProvider.interceptors.push(injections.services.httpInterceptorService)
        }
    }
}
