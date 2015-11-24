///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function AutoFillFix():ng.IDirective {
        return function(scope, elem, attrs) {
            // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
            elem.prop('method', 'POST');

            // Fix autofill issues where Angular doesn't know about autofilled inputs
            if(attrs.ngSubmit) {
                setTimeout(function() {
                    elem.unbind('submit').bind('submit', function(e) {
                        e.preventDefault();
                        elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
                        scope.$apply(attrs.ngSubmit);
                        e.target.parentNode.removeChild(e.target); // Or alternatively just hide the form: e.target.style.display = 'none';
                        history.replaceState({success:true}, 'title', "/success.html");
                    });
                }, 0);
            }
        };
    }
}