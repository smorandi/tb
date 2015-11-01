///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class AuthService {
        private credentials:interfaces.ICredentials;
        private token:string;
        private storage:interfaces.ILocalStorage;

        static $inject = [
            injections.angular.$log,
            injections.angular.$window,
            injections.services.localStorage
        ];

        constructor(private $log:ng.ILogService, private $window:ng.IWindowService, private LocalStorage:interfaces.ILocalStorage ) {
            this.token = LocalStorage.get(constants.localstorage.credentialKey);
            this.storage = LocalStorage;

        }

        public setCredentials(credentials:interfaces.ICredentials) {
            this.credentials = credentials;
            this.token = this.$window.btoa(credentials.loginname + ":" + credentials.password);
            this.storage.save(constants.localstorage.credentialKey, this.token);
        }

        public clearCredentials() {
            this.$log.info("credentials cleared");
            this.credentials = null;
            this.token = null;
            this.storage.remove(constants.localstorage.credentialKey);
        }

        public getCredentials():interfaces.ICredentials {
            return this.credentials;
        }

        public getToken():string {
            return this.token;
        }
    }
}