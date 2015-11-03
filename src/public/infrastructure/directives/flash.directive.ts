///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function Flash($timeout:ng.ITimeoutService):ng.IDirective {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                scope.$watch(attrs.flash, function (nv, ov) {
                    function settimeout() {
                        attrs.timeout = $timeout(function () {
                            element.removeClass("flash flash-active");
                            attrs.timeout = null;
                        }, 1000);
                    }

                    if (nv !== ov) {
                        if (attrs.timeout) {
                            //newvalue already set.. reset timeout
                            $timeout.cancel(attrs.timeout);
                            settimeout();
                        } else {
                            if (!element.hasClass("flash")) {
                                element.addClass("flash flash-active");
                            }
                            settimeout();
                        }
                    }
                });
            }
        };
    }
}