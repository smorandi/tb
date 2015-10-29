///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class RegisterController {
        public customer = new models.RegisterCustomer();

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.authService,
            injections.services.utilsService,
            "rootResource"];

        constructor(
            private $log:ng.ILogService,
            private $location:ng.ILocationService,
            private $state:ng.ui.IStateService,
            private authService:services.AuthService,
            private utilsService:services.UtilsService,
            private rootResource) {
            $log.info("RegisterController called with client-url: '" + $location.path() + "'");
        }

        private signUp() {
            this.rootResource.$post("register", {}, this.customer).then(res => {
                this.utilsService.alert("You have signed up!");
                this.authService.setCredentials(new models.Credentials(this.customer.loginname, this.customer.lastname));
                this.$state.go(constants.LINKS.home.state, {}, {});
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }

        private cancel() {
            this.$state.go(constants.LINKS.dashboard.state, {}, {});
        }
    }
}