///<reference path="../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DrinkEditController = (function () {
        function DrinkEditController($log, $location, $state, utilsService, drinkResource) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.utilsService = utilsService;
            this.drinkResource = drinkResource;
            $log.info("DrinkEditController called with client-url: " + $location.path());
            //as we cannot directly edit the read-only instance of resource, we clone it...
            this.drink = JSON.parse(JSON.stringify(drinkResource));
        }
        DrinkEditController.prototype.updateDrink = function () {
            var _this = this;
            this.drinkResource.$put("update", {}, this.drink).then(function (res) {
                _this.utilsService.alert("The drink has been updated!");
                _this.$state.go("^", {}, { reload: true });
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        DrinkEditController.$inject = [injections.angular.$log, injections.angular.$location, injections.uiRouter.$stateService, injections.services.utilsService, "drinkResource"];
        return DrinkEditController;
    })();
    controllers.DrinkEditController = DrinkEditController;
})(controllers || (controllers = {}));
//# sourceMappingURL=drink-edit.controller.js.map