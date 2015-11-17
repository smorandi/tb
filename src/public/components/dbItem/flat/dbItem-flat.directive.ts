///<reference path="../../../all.references.ts" />
"use strict";

module directives {
    export function DbItemFlat():ng.IDirective {
        return {
            restrict: "E",
            scope: {},
            templateUrl: injections.components.dbItem.flat.template,
            controller: injections.components.dbItem.flat.controller,
            controllerAs: "vm",
            bindToController: {
                item: "="
            }
        };
    }
}