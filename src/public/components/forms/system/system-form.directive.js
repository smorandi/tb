///<reference path="../../../all.references.ts" />
"use strict";
var directives;
(function (directives) {
    function SystemForm() {
        return {
            restrict: "E",
            scope: {},
            templateUrl: injections.components.forms.system.template,
            controller: injections.components.forms.system.controller,
            controllerAs: "vm",
            bindToController: {
                submit: "&",
                cancel: "&",
                readOnly: "=",
                data: "=",
                form: "="
            }
        };
    }
    directives.SystemForm = SystemForm;
})(directives || (directives = {}));
//# sourceMappingURL=system-form.directive.js.map