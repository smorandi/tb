///<reference path="../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var RegisterController = (function () {
        function RegisterController(logger, $location, $state, authService, rootResource) {
            this.logger = logger;
            this.$location = $location;
            this.$state = $state;
            this.authService = authService;
            this.rootResource = rootResource;
            this.user = new models.RegisterCustomer();
            this.isEdit = true;
            this.logger.info("RegisterController called with client-url: '" + $location.path() + "'");
        }
        RegisterController.prototype.submitUserForm = function () {
            var _this = this;
            if (this.userForm.$valid) {
                this.rootResource.$post("register", {}, this.user)
                    .then(function (res) {
                    _this.authService.setCredentials(new models.Credentials(_this.user.loginname, _this.user.password));
                    _this.$state.go(constants.LINKS.home.state, {}, {})
                        .then(function (res) {
                        _this.logger.info("Sign-Up Completed", "You have been successfully registered", enums.LogOptions.toast_only);
                    })
                        .catch(function (err) {
                        _this.logger.error("Sign-Up Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                    });
                })
                    .catch(function (err) {
                    _this.logger.error("Sign-Up Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                });
            }
        };
        RegisterController.prototype.cancel = function () {
            this.$state.go(constants.LINKS.dashboard.state, {}, {});
        };
        RegisterController.$inject = [
            injections.services.loggerService,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.authService,
            "rootResource"];
        return RegisterController;
    })();
    controllers.RegisterController = RegisterController;
})(controllers || (controllers = {}));
//# sourceMappingURL=register.controller.js.map