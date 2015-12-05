///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function StopEvent():ng.IDirective {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.bind("click", function (e) {
                    e.stopPropagation();
                });
                element.bind("keypress", function (e) {
                    e.stopPropagation();
                });
            }
        };
    }
}