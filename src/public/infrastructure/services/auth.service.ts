///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class AuthService {
        private credentials:interfaces.ICredentials;
        private token:string;

        static $inject = [
            injections.angular.$log,
            injections.angular.$window,
        ];

        constructor(private $log:ng.ILogService, private $window:ng.IWindowService ) {
            this.token = null;
        }

        public setCredentials(credentials:interfaces.ICredentials) {
            this.credentials = credentials;
            this.token = this.$window.btoa(credentials.loginname + ":" + credentials.password);
        }

        public clearCredentials() {
            this.$log.info("credentials cleared");
            this.credentials = null;
            this.token = null;
        }

        public getCredentials():interfaces.ICredentials {
            return this.credentials;
        }

        public getToken():string {
            return this.token;
        }
    }
}