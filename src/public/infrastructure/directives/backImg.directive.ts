///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function BackImg():ng.IDirective {
        return function (scope, element, attrs) {
            attrs.$observe('backImg', value => {
                element.css({
                    'background-image': 'url(' + value + ')',
                    'background-size': 'cover'
                });
            });
        };
    }
}