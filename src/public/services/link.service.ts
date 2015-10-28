///<reference path="../all.references.ts" />

module services {
    export class LinkService {
        constructor(private $log:ng.ILogService, private $state:ng.ui.IStateService) {
        }

        public goToState(state:string) {
            this.$state.go(state);
        }

        public goToLink(link:string) {
            return this.goToState(this.getState(link));
        }

        public getState(link:string) {
            return constants.LINK_TO_STATE_MAP[link];
        }

        public getName(link:string) {
            return constants.LINK_TO_NAME_MAP[link];
        }
    }
}