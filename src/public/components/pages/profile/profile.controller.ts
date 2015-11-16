///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class ProfileController {
        private user = new models.UserProfile();
        private userForm:ng.IFormController;
        private isEdit:boolean = false;

        static $inject = [
            injections.services.loggerService,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.extServices.lodash,
            injections.services.authService,
            injections.services.modalService,
            "profileResource"];

        constructor(private logger:services.LoggerService,
                    private $location:ng.ILocationService,
                    private $state:ng.ui.IStateService,
                    private _:_.LoDashStatic,
                    private authService:services.AuthService,
                    private modal:services.ModalService,
                    private profileResource) {
            this.logger.info("ProfileController called with client-url: " + $location.path());

            // assigns the values contained in the resource for which we have keys for...
            _.assign(this.user, _.pick(this.profileResource, _.keys(this.user)));
        }

        public edit():void {
            this.isEdit = true;
        }

        public save():void {
            this.profileResource.$put("update", {}, this.user)
                .then(res => {
                    this.authService.setCredentials(new models.Credentials(this.user.loginname, this.user.password));
                    this.$state.reload()
                        .then(res => {
                            this.logger.info("Change successfull", "Your user has been updated", enums.LogOptions.toast);
                        })
                        .catch(err => {
                            this.logger.error("Change Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                        });
                })
                .catch(err => {
                    this.logger.error("Change Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                });
        }

        public cancel():void {
            this.$state.reload();
        }

        public unregister():void {
            var modalOptions = {
                closeButtonText: "Cancel",
                actionButtonText: "Unregister",
                glyph: "glyphicon glyphicon-trash",
                headerText: "Unregister",
                bodyText: "Are you sure you want to unregister?"
            };

            this.modal.showModal({}, modalOptions)
                .then(res => {
                    this.profileResource.$del("delete")
                        .then(res => {
                            this.authService.clearCredentials();
                            this.$state.go(constants.LINKS.dashboard.state, {}, {reload: true})
                                .then(res => {
                                    this.logger.info("Unregister successfull", "", enums.LogOptions.toast);
                                })
                                .catch(err => {
                                    this.logger.error("Unregister Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                                });
                        })
                        .catch(err => {
                            this.logger.error("Unregister Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                        });
                });
        }
    }
}