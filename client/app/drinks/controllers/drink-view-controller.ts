///<reference path='../../../typings/tsd.d.ts' />

module drinks.controllers {
    'use strict';

    class DrinkViewController {
        link:any;
        drink:any;

        public static $inject = ["$log", "$scope", "$state", "$stateParams", "popupService", "halClient"];

        constructor(private $log:ng.ILogService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private popupService, private halClient) {
            // have to decode here...no clue but this is called twice by the ng-framework. first with a correct string and the second time with a uriEncoded string.
            this.link = decodeURIComponent($stateParams["link"]);

            halClient.$get(this.link).then(res => this.drink = res);
        }

        public deleteDrink():void {
            if (this.popupService.showPopup('Really delete this?')) {
                this.drink.$del("delete").then(res => this.$state.reload());
            }
            event.stopPropagation();
        }
    }

    angular.module('drinks').controller('DrinkViewController', DrinkViewController);
}
