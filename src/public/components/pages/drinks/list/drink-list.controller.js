///<reference path="../../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DrinkListController = (function () {
        function DrinkListController($log, $location, $state, utilsService, drinksResource, drinkResources) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.utilsService = utilsService;
            this.drinksResource = drinksResource;
            this.drinkResources = drinkResources;
            $log.info("DrinkListController called with client-url: " + $location.path());
            if ($state.params.id) {
                this.activeItem = $state.params.id;
            }
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
        DrinkListController.prototype.createNewDrink = function () {
            this.$state.go("root.home.drinks.overview.list.newDrink");
        };
        DrinkListController.prototype.viewDrink = function (drink) {
            this.activeItem = drink.id;
            this.$state.go("root.home.drinks.overview.list.details", { id: drink.id });
        };
        DrinkListController.$inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            "drinksResource",
            "drinkResources"
        ];
        return DrinkListController;
    })();
    controllers.DrinkListController = DrinkListController;
})(controllers || (controllers = {}));
//# sourceMappingURL=drink-list.controller.js.map