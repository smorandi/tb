///<reference path="../../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DrinkCreateController = (function () {
        function DrinkCreateController($log, $location, $state, drinksResource, logger) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.drinksResource = drinksResource;
            this.logger = logger;
            this.drink = new models.DrinkProperties();
            this.edit = false;
            $log.info("DrinkEditController called with client-url: " + $location.path());
        }
        DrinkCreateController.prototype.createDrink = function () {
            var _this = this;
            if (this.drinkForm.$valid) {
                this.drinksResource.$post("create", {}, this.drink).then(function (res) {
                    _this.$state.go("root.home.drinks.overview.list", {}, { reload: true })
                        .then(function (res) {
                        _this.logger.info("The drink has been created!", "", enums.LogOptions.toast);
                    });
                }).catch(function (err) {
                    try {
                        _this.logger.error(err.data.name, err.data.message, enums.LogOptions.toast);
                    }
                    catch (e) {
                        _this.logger.error("Error", err, enums.LogOptions.toast);
                    }
                });
            }
        };
        DrinkCreateController.prototype.cancel = function () {
            this.$state.go("^", {}, { reload: true });
        };
        DrinkCreateController.$inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            "drinksResource",
            injections.services.loggerService,
        ];
        return DrinkCreateController;
    })();
    controllers.DrinkCreateController = DrinkCreateController;
})(controllers || (controllers = {}));
//# sourceMappingURL=drink-create.controller.js.map