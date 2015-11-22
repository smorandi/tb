///<reference path="../../../all.references.ts" />

"use strict";

module directives {
    export function UserForm():ng.IDirective {
        return {
            restrict: "E",
            scope:{},
            templateUrl: injections.components.forms.user.template,
            controller: injections.components.forms.user.controller,
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
}