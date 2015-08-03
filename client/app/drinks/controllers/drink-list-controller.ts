///<reference path="../../../typings/tsd.d.ts" />
///<reference path="../../services/resources-factory.ts" />

module drinks.controllers {
    "use strict";

    class DrinkListController {
        drinks:ng.resource.IResourceArray<services.IDrink>;
        query:string;

        public static $inject = ["$log", "$scope", "$state", "services.popupService", "services.drinkResource"];

        constructor(private $log:ng.ILogService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private popupService, private drinkResource:services.IDrinkResource) {
            this.drinks = drinkResource.query();
        }

        deleteDrink(drink:services.IDrink, event:Event) {
            if (this.popupService.showPopup('Really delete this?')) {
                drink.$delete(() => this.$state.reload());
            }
            event.stopPropagation();
        }
    }

    angular.module("drinks").controller("DrinkListController", DrinkListController);
}
