///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class AuthService {
        private token:string;

        static $inject = [
            injections.angular.$log,
            injections.angular.$window,
        ];

        constructor(private $log:ng.ILogService, private $window:ng.IWindowService) {
            this.token = null;
        }

        public setToken(username:string, password:string) {
            this.token = this.$window.btoa(username + ":" + password);
        }

        public clearToken() {
            this.$log.info("token cleared");
            this.token = null;
        }

        public getToken():string {
            return this.token;
        }
    }
}