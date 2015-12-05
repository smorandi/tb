///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class FocusService {
        static $inject = [
            injections.services.loggerService,
            injections.angular.$timeoutService,
            injections.angular.$window
        ];

        constructor(private logger:services.LoggerService, private $timeout:ng.ITimeoutService, private $window:ng.IWindowService) {
            this.logger.debug("FocusService created");
        }

        private doFocus(element:any) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            this.$timeout(() => {
                if (element) {
                    element.focus();
                }
            });
        }

        public focusById(id:string):void {
            var element = this.$window.document.getElementById(id);
            this.doFocus(element);
        }

        public focusByElement(element:any):void {
            this.doFocus(element);
        }

        public focusByClass(cls:any):void {
            var element = this.$window.document.getElementsByClassName(cls);
            this.doFocus(element);
        }
    }
}