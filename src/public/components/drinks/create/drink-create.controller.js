///<reference path="../../../all.references.ts" />
"use strict";
var controllers;
(function (controllers) {
    var DrinkCreateController = (function () {
        function DrinkCreateController($log, $location, $state, utilsService, drinksResource) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.utilsService = utilsService;
            this.drinksResource = drinksResource;
            $log.info("DrinkEditController called with client-url: " + $location.path());
        }
        DrinkCreateController.prototype.createDrink = function () {
            var _this = this;
            this.drinksResource.$post("create", {}, this.drink).then(function (res) {
                _this.utilsService.alert("The drink has been updated!");
                _this.$state.go(".list", {}, { relative: _this.$state.get("root.home.drinks.overview"), reload: true });
            }).catch(function (err) {
                _this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        };
        DrinkCreateController.$inject = [injections.angular.$log, injections.angular.$location, injections.uiRouter.$stateService, injections.services.utilsService, "drinksResource"];
        return DrinkCreateController;
    })();
    controllers.DrinkCreateController = DrinkCreateController;
})(controllers || (controllers = {}));
//# sourceMappingURL=drink-create.controller.js.map