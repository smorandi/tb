///<reference path="../../../all.references.ts" />

"use strict";

module directives {
    export function SystemForm():ng.IDirective {
        return {
            restrict: "E",
            scope:{},
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
}