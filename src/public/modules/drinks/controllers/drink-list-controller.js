///<reference path="../../../all.references.ts" />
var drinks;
(function (drinks) {
    "use strict";
    var DrinkListController = (function () {
        function DrinkListController($log, $location, $scope, $state, $stateParams, utilsService, drinksResource, drinkResources) {
            this.$log = $log;
            this.$location = $location;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.utilsService = utilsService;
            this.drinksResource = drinksResource;
            this.drinkResources = drinkResources;
            $log.info("DrinkListController called with client-url: " + $location.path());
        }
        DrinkListController.prototype.canCreateNewDrink = function () {
            return this.drinksResource === undefined ? false : this.drinksResource.$has("create");
        };
        DrinkListController.prototype.canDeleteAllDrinks = function () {
            return this.drinksResource === undefined ? false : this.drinksResource.$has("delete");
        };
        DrinkListController.prototype.canDelete = function (drink) {
            return drink.$has("delete");
        };
        DrinkListController.prototype.deleteDrink = function (drink, event) {
            var _this = this;
            if (this.utilsService.showPopup('Really delete this?')) {
                drink.$del("delete").then(function (x) { return _this.$state.reload(); });
            }
            event.stopPropagation();
        };
        DrinkListController.prototype.deleteAllDrinks = function (event) {
            var _this = this;
            if (this.canDeleteAllDrinks()) {
                if (this.utilsService.showPopup('Really delete all drinks?')) {
                    this.drinksResource.$del("delete").then(function (res) { return _this.$state.go("drinks", {}, { reload: true }); });
                }
                event.stopPropagation();
            }
        };
        DrinkListController.prototype.createNewDrink = function () {
            this.$state.go("root.home.drinks.newDrink");
        };
        DrinkListController.prototype.viewDrink = function (drink) {
            this.$state.go("root.home.drinks.overview.list.detail", { id: drink.id });
        };
        DrinkListController.$inject = ["$log", "$location", "$scope", "$state", "$stateParams", "utilsService", "drinksResource", "drinkResources"];
        return DrinkListController;
    })();
    angular.module("drinks").controller("DrinkListController", DrinkListController);
})(drinks || (drinks = {}));
//# sourceMappingURL=drink-list-controller.js.map