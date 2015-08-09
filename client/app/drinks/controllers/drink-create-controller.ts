///<reference path="../../../typings/tsd.d.ts" />

module drinks.controllers {
    "use strict";

    class DrinkCreateController {
        link:any;
        drink:any;

        public static $inject = ["$log", "$scope", "$state", "$stateParams", "popupService", "halClient"];

        constructor(private $log:ng.ILogService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private popupService, private halClient) {
            this.link = decodeURIComponent($stateParams["link"]);
        }

        createDrink():void {
            console.log(this.drink);
            this.halClient.$post(this.link, {}, this.drink).then(res => {
                this.popupService.alert("The drink has been created!");
            }).catch(err => {
                this.popupService.alert(JSON.stringify(err, undefined, 2));
            });
        }
    }

    angular.module('drinks').controller('DrinkCreateController', DrinkCreateController);
}