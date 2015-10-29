///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class HttpInterceptorService {
        static $inject = [
            injections.angular.$log,
            injections.angular.$qService,
            injections.services.authService,
        ];

        constructor(private $log:ng.ILogService, private $q:ng.IQService, private authService:services.AuthService) {
        }

        // optional method
        public request = config => {
            // do something on success
            if (this.authService.getToken()) {
                config.headers.Authorization = "Basic " + this.authService.getToken();
            }

            return config;
        }

        // optional method
        public requestError = rejection => {
            // do something on error
            return this.$q.reject(rejection);
        }

        // optional method
        public response = response => {
            // do something on success
            return response;
        }
        public responseError = rejection => {
            // do something on error
            return this.$q.reject(rejection);
        }
    }
}