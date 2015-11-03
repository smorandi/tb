///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function BackImg():ng.IDirective {
        return function(scope, element, attrs){
            var url = attrs.backImg;
            element.css({
                'background-image': 'url(' + url +')',
                'background-size' : 'cover'
            });
        };
    }
}