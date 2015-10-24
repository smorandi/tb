///<reference path="../all.references.ts" />

module services {
    export class AuthService {
        private token:string;

        constructor(private $window:ng.IWindowService, private $log:ng.ILogService) {
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