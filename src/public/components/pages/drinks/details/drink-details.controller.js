///<reference path="../../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DrinkDetailsController = (function () {
        function DrinkDetailsController($log, $location, $state, utilsService, drinkResource, logger) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.utilsService = utilsService;
            this.drinkResource = drinkResource;
            this.logger = logger;
            this.edit = true;
            $log.info("DrinkDetailsController called with client-url: " + $location.path());
            this.drink = drinkResource;
        }
        DrinkDetailsController.prototype.canDelete = function () {
            return this.drink ? this.drink.$has("delete") : false;
        };
        DrinkDetailsController.prototype.canEdit = function () {
            return this.drink ? this.drink.$has("update") : false;
        };
        DrinkDetailsController.prototype.deleteDrink = function (event) {
            var _this = this;
            if (this.utilsService.showPopup("Really delete this?")) {
                this.drink.$del("delete").then(function (res) { return _this.$state.go(constants.STATES.drinks, null, { reload: true }); });
            }
            event.stopPropagation();
        };
        DrinkDetailsController.prototype.editDrink = function () {
            this.$state.go(".editDrink");
        };
        DrinkDetailsController.$inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            "drinkResource",
            injections.services.loggerService];
        return DrinkDetailsController;
    })();
    controllers.DrinkDetailsController = DrinkDetailsController;
})(controllers || (controllers = {}));
//# sourceMappingURL=drink-details.controller.js.map