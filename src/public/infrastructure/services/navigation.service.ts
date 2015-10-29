///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class NavigationService {
        static $inject = [injections.angular.$log, injections.uiRouter.$stateService];

        constructor(private $log:ng.ILogService, private $state:ng.ui.IStateService) {
        }

        public go(state:string) {
            this.$state.go(state);
        }
    }
}