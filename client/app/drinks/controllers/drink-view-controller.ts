///<reference path='../../../typings/tsd.d.ts' />
///<reference path="../../services/resources-factory.ts" />

module drinks.controllers {
    'use strict';

    class DrinkViewController {
        drink:services.IDrink;

        public static $inject = ["$log", "$scope", "$state", "$stateParams", "services.popupService", "services.drinkResource"];

        constructor(private $log:ng.ILogService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private popupService, private drinkResource:services.IDrinkResource) {
            this.drink = drinkResource.get({id: $stateParams["id"]});
        }
    }

    angular.module('drinks').controller('DrinkViewController', DrinkViewController);
}
