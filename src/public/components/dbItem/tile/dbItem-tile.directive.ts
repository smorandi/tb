///<reference path="../../../all.references.ts" />
"use strict";

module directives {
    export function DbItemTile():ng.IDirective {
        return {
            restrict: "E",
            scope: {},
            templateUrl: injections.components.dbItem.tile.template,
            controller: injections.components.dbItem.tile.controller,
            controllerAs: "vm",
            bindToController: {
                item: "="
            }
        };
    }
}