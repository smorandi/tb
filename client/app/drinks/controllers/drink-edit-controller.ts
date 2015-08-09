///<reference path="../../../typings/tsd.d.ts" />

module drinks.controllers {
    "use strict";

    class DrinkEditController {
        link:any;
        drink:any;

        public static $inject = ["$log", "$scope", "$state", "$stateParams", "popupService", "halClient"];

        constructor(private $log:ng.ILogService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private popupService, private halClient) {
            this.link = decodeURIComponent($stateParams["url"]);
            this.drink = $stateParams["resource"];
        }

        updateDrink():void {
            this.halClient.$put(this.link, {}, this.drink).then(res => {
                this.popupService.alert("The drink has been updated!");
                this.$state.go("drinks.viewDrink", {url:res.$href("self"), resource: res}, {reload: true});
            }).catch(err => {
                this.popupService.alert(JSON.stringify(err, undefined, 2));
            });
        }
    }

    angular.module("drinks").controller("DrinkEditController", DrinkEditController);
}
