///<reference path="../../all.references.ts" />
"use strict";

module directives {
    export function PageHeader():ng.IDirective {
        return {
            templateUrl: "components/header/pageHeader.html",
            scope: {
                title: "@",
                subtitle: "@"
            }
        };
    }
}