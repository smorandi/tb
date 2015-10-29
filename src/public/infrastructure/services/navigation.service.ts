///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class NavigationService {
        static $inject = [injections.angular.$log, injections.uiRouter.$stateService];

        constructor(private $log:ng.ILogService, private $state:ng.ui.IStateService) {
        }

        //public go(rel:string) {
        //    this.$state.go(constants.REL_TO_LINK_MAP[rel].state);
        //}
        public go(link:interfaces.ILink) {
            this.$state.go(link.state);
        }
    }
}