///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class RegisterController {
        private user = new models.RegisterCustomer();
        private userForm:ng.IFormController;

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

        public signUp() {
            if(this.userForm.$valid) {
                this.rootResource.$post("register", {}, this.user)
                    .then(res => {
                        this.authService.setCredentials(new models.Credentials(this.user.loginname, this.user.loginname));
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
        }

        public cancel() {
            this.$state.go(constants.LINKS.dashboard.state, {}, {});
        }
    }
}