///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class AuthService {
        private credentials:interfaces.ICredentials;
        private token:string;

        static $inject = [
            injections.angular.$log,
            injections.angular.$window,
            injections.services.localStorageService
        ];

        constructor(private $log:ng.ILogService, private $window:ng.IWindowService, private localStorage:services.LocalStorageService) {
            this.token = localStorage.get(constants.LOCAL_STORAGE.credentialKey);
        }

        public setCredentials(credentials:interfaces.ICredentials) {
            this.credentials = credentials;
            this.token = this.$window.btoa(credentials.loginname + ":" + credentials.password);
            this.localStorage.save(constants.LOCAL_STORAGE.credentialKey, this.token);
        }

        public clearCredentials() {
            this.$log.info("credentials cleared");
            this.credentials = null;
            this.token = null;
            this.localStorage.remove(constants.LOCAL_STORAGE.credentialKey);
        }

        public getCredentials():interfaces.ICredentials {
            return this.credentials;
        }

        public getToken():string {
            return this.token;
        }
    }
}