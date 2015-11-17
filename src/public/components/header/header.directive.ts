///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function Header():ng.IDirective {
        return {
            restrict: "E",
            scope:{},
            templateUrl: injections.components.header.template,
            controller: injections.components.header.controller,
            controllerAs: "vm",
        };
    }
}