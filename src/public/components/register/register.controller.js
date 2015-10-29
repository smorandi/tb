///<reference path="../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var RegisterController = (function () {
        function RegisterController($log, $location, $state, authService, utilsService, rootResource) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.authService = authService;
            this.utilsService = utilsService;
            this.rootResource = rootResource;
            this.customer = new models.RegisterCustomer();
            $log.info("RegisterController called with client-url: '" + $location.path() + "'");
        }
        RegisterController.prototype.signUp = function () {
            var _this = this;
            this.rootResource.$post("register", {}, this.customer).then(function (res) {
                _this.utilsService.alert("You have signed up!");
                _this.authService.setCredentials(new models.Credentials(_this.customer.loginname, _this.customer.lastname));
                _this.$state.go(constants.LINKS.home.state, {}, {});
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        RegisterController.prototype.cancel = function () {
            this.$state.go(constants.LINKS.dashboard.state, {}, {});
        };
        RegisterController.$inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.authService,
            injections.services.utilsService,
            "rootResource"];
        return RegisterController;
    })();
    controllers.RegisterController = RegisterController;
})(controllers || (controllers = {}));
//# sourceMappingURL=register.controller.js.map