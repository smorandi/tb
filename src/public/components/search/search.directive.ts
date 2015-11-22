///<reference path="../../all.references.ts" />
"use strict";

module directives {
    export function Search():ng.IDirective {
        return {
            restrict: "E",
            scope: {},
            templateUrl: injections.components.search.template,
            controller: injections.components.search.controller,
            controllerAs: "vm",
            bindToController: {
                search: "="
            }
        };
    }
}