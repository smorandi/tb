///<reference path="../../all.references.ts" />
"use strict";

module directives {
    export function PageHeader():ng.IDirective {
        return {
            restrict: "E",
            scope: {},
            templateUrl: injections.components.pageHeader.template,
            controller: injections.components.pageHeader.controller,
            controllerAs: "vm",
            bindToController: {
                title: "@",
                subtitle: "@"
            },
        };
    }
}