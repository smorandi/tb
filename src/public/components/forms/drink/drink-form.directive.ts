///<reference path="../../../all.references.ts" />

"use strict";

module directives {
    export function DrinkForm():ng.IDirective {
        return {
            restrict: "E",
            scope:{},
            templateUrl: injections.components.forms.drink.template,
            controller: injections.components.forms.drink.controller,
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
