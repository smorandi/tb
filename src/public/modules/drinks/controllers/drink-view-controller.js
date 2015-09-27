///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />
var drinks;
(function (drinks) {
    "use strict";
    var DrinkViewController = (function () {
        function DrinkViewController($log, $location, $state, utilsService, drinkResource) {
            this.$log = $log;
            this.$location = $location;
            this.$state = $state;
            this.utilsService = utilsService;
            this.drinkResource = drinkResource;
            $log.info("DrinkViewController called with client-url: " + $location.path());
            this.drink = drinkResource;
        }
        DrinkViewController.prototype.canDelete = function () {
            return this.drink === undefined ? false : this.drink.$has("delete");
        };
        DrinkViewController.prototype.canEdit = function () {
            return this.drink === undefined ? false : this.drink.$has("update");
        };
        DrinkViewController.prototype.deleteDrink = function (event) {
            var _this = this;
            if (this.utilsService.showPopup("Really delete this?")) {
                this.drink.$del("delete").then(function (res) { return _this.$state.go("^.list"); });
            }
            event.stopPropagation();
        };
        DrinkViewController.prototype.editDrink = function () {
            this.$state.go(".editDrink");
        };
        DrinkViewController.$inject = ["$log", "$location", "$state", "utilsService", "drinkResource"];
        return DrinkViewController;
    })();
    angular.module("drinks").controller("DrinkViewController", DrinkViewController);
})(drinks || (drinks = {}));
//# sourceMappingURL=drink-view-controller.js.map