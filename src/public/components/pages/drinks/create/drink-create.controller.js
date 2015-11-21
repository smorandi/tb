///<reference path="../../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DrinkCreateController = (function () {
        function DrinkCreateController($log, $location, $state, utilsService, drinksResource, logger) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.utilsService = utilsService;
            this.drinksResource = drinksResource;
            this.logger = logger;
            $log.info("DrinkEditController called with client-url: " + $location.path());
        }
        DrinkCreateController.prototype.createDrink = function () {
            var _this = this;
            this.drinksResource.$post("create", {}, this.drink).then(function (res) {
                _this.logger.error("The drink has been updated!", "", enums.LogOptions.toast);
                //this.utilsService.alert("The drink has been updated!");
                _this.$state.go(".list", {}, { relative: _this.$state.get("root.home.drinks.overview"), reload: true });
            }).catch(function (err) {
                try {
                    _this.logger.error(err.data.name, err.data.message, enums.LogOptions.toast);
                }
                catch (e) {
                    _this.logger.error("Error", err, enums.LogOptions.toast);
                }
            });
        };
        DrinkCreateController.$inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            "drinksResource",
            injections.services.loggerService,
        ];
        return DrinkCreateController;
    })();
    controllers.DrinkCreateController = DrinkCreateController;
})(controllers || (controllers = {}));
//# sourceMappingURL=drink-create.controller.js.map