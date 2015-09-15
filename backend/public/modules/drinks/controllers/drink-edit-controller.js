///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />
var drinks;
(function (drinks) {
    "use strict";
    var DrinkEditController = (function () {
        function DrinkEditController($log, $location, $state, utilsService, drinkResource) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.utilsService = utilsService;
            this.drinkResource = drinkResource;
            $log.info("DrinkEditController called with client-url: " + $location.path());
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
        DrinkEditController.$inject = ["$log", "$location", "$state", "utilsService", "drinkResource"];
        return DrinkEditController;
    })();
    angular.module("drinks").controller("DrinkEditController", DrinkEditController);
})(drinks || (drinks = {}));
//# sourceMappingURL=drink-edit-controller.js.map