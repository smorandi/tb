///<reference path="../../all.references.ts" />
"use strict";

module directives {
    export function PageHeader():ng.IDirective {
        return {
            restrict: "E",
            templateUrl: injections.components.pageHeader.template,
            scope: {
                title: "@",
                subtitle: "@"
            }
        };
    }
}