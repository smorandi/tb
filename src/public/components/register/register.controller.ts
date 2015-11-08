///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class RegisterController {
        public customer = new models.RegisterCustomer();

        static $inject = [
            injections.services.loggerService,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.authService,
            "rootResource"];

        constructor(private logger:services.LoggerService,
                    private $location:ng.ILocationService,
                    private $state:ng.ui.IStateService,
                    private authService:services.AuthService,
                    private rootResource) {
            this.logger.info("RegisterController called with client-url: '" + $location.path() + "'");
        }

        private signUp() {
            this.rootResource.$post("register", {}, this.customer)
                .then(res => {
                    this.authService.setCredentials(new models.Credentials(this.customer.loginname, this.customer.password));
                    this.$state.go(constants.LINKS.home.state, {}, {})
                        .then(res => {
                            this.logger.info("Sign-Up Completed", "You have been successfully registered", enums.LogOptions.toast_only);
                        })
                        .catch(err => {
                            this.logger.error("Sign-Up Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                        });
                })
                .catch(err => {
                    this.logger.error("Sign-Up Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                });
        }

        private cancel() {
            this.$state.go(constants.LINKS.dashboard.state, {}, {});
        }
    }
}