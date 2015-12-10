///<reference path="../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var ProfileController = (function () {
        function ProfileController(logger, $location, $state, _, authService, modal, profileResource) {
            this.logger = logger;
            this.$location = $location;
            this.$state = $state;
            this._ = _;
            this.authService = authService;
            this.modal = modal;
            this.profileResource = profileResource;
            this.isEdit = false;
            this.logger.info("ProfileController called with client-url: " + $location.path());
            // assigns the values contained in the resource for which we have keys for...
            this.user = angular.copy(profileResource);
        }
        ProfileController.prototype.edit = function () {
            this.isEdit = true;
        };
        ProfileController.prototype.save = function () {
            var _this = this;
            if (this.userForm.$valid && this.isEdit) {
                this.profileResource.$put("update", {}, this.user)
                    .then(function (res) {
                    _this.authService.setCredentials(new models.Credentials(_this.user.loginname, _this.user.password));
                    _this.$state.reload()
                        .then(function (res) {
                        _this.logger.info("Change successfull", "Your user has been updated", enums.LogOptions.toast);
                    })
                        .catch(function (err) {
                        _this.logger.error("Change Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                    });
                })
                    .catch(function (err) {
                    _this.logger.error("Change Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                });
            }
        };
        ProfileController.prototype.cancel = function () {
            this.$state.reload();
        };
        ProfileController.prototype.unregister = function () {
            var _this = this;
            var modalOptions = {
                headerText: "dialog.unregister.header",
                bodyText: "dialog.unregister.body",
                closeButtonText: "dialog.unregister.btn.cancel",
                actionButtonText: "dialog.unregister.btn.unregister",
                glyph: "glyphicon glyphicon-trash"
            };
            this.modal.showModal({}, modalOptions)
                .then(function (res) {
                _this.profileResource.$del("delete")
                    .then(function (res) {
                    _this.authService.clearCredentials();
                    _this.$state.go(constants.LINKS.dashboard.state, {}, { reload: true })
                        .then(function (res) {
                        _this.logger.info("Unregister successfull", "", enums.LogOptions.toast);
                    })
                        .catch(function (err) {
                        _this.logger.error("Unregister Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                    });
                })
                    .catch(function (err) {
                    _this.logger.error("Unregister Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                });
            });
        };
        ProfileController.$inject = [
            injections.services.loggerService,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.extServices.lodash,
            injections.services.authService,
            injections.services.modalService,
            "profileResource"];
        return ProfileController;
    })();
    controllers.ProfileController = ProfileController;
})(controllers || (controllers = {}));
//# sourceMappingURL=profile.controller.js.map