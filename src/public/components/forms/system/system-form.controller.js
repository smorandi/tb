"use strict";
var controllers;
(function (controllers) {
    var SystemForm = (function () {
        function SystemForm(logger) {
            this.logger = logger;
        }
        SystemForm.$inject = [
            injections.services.loggerService
        ];
        return SystemForm;
    })();
    controllers.SystemForm = SystemForm;
})(controllers || (controllers = {}));
//# sourceMappingURL=system-form.controller.js.map