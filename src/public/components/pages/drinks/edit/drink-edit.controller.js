///<reference path="../../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DrinkEditController = (function () {
        function DrinkEditController($log, $location, $state, utilsService, drinkResource, logger) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.utilsService = utilsService;
            this.drinkResource = drinkResource;
            this.logger = logger;
            this.edit = false;
            $log.info("DrinkEditController called with client-url: " + $location.path());
            //as we cannot directly edit the read-only instance of resource, we clone it...
            this.drink = JSON.parse(JSON.stringify(drinkResource));
        }
        DrinkEditController.prototype.updateDrink = function () {
            var _this = this;
            this.drinkResource.$put("update", {}, this.drink).then(function (res) {
                _this.logger.error("The drink has been updated!", null, enums.LogOptions.toast_only);
                _this.$state.go("^", {}, { reload: true });
            }).catch(function (err) {
                try {
                    _this.logger.error(err.data.name, err.data.message, enums.LogOptions.toast);
                }
                catch (e) {
                    _this.logger.error("Error", err, enums.LogOptions.toast);
                }
            });
        };
        DrinkEditController.$inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            "drinkResource",
            injections.services.loggerService,
        ];
        return DrinkEditController;
    })();
    controllers.DrinkEditController = DrinkEditController;
})(controllers || (controllers = {}));
//# sourceMappingURL=drink-edit.controller.js.map