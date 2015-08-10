///<reference path="../../../../typings/tsd.d.ts" />

module drinks.controllers {
    "use strict";

    class DrinkCreateController {
        url:any;
        drink:any;

        public static $inject = ["$log", "$scope", "$state", "$stateParams", "popupService", "halClient"];

        constructor(private $log:ng.ILogService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private popupService, private halClient) {
            $log.info("DrinkCreateController called with url: " + $stateParams["url"]);

            this.url = decodeURIComponent($stateParams["url"]);
        }

        createDrink():void {
            this.halClient.$post(this.url, {}, this.drink).then(res => {
                this.popupService.alert("The drink has been created!");
                this.$state.go("drinks", {}, {reload: true});
            }).catch(err => {
                this.popupService.alert(JSON.stringify(err, undefined, 2));
            });
        }
    }

    angular.module('drinks').controller('DrinkCreateController', DrinkCreateController);
}