"use strict";
var controllers;
(function (controllers) {
    var DrinkDetailsController = (function () {
        function DrinkDetailsController(logger, $location, $state, modal, $translate, drinkResource, edit) {
            if (edit === void 0) { edit = false; }
            this.logger = logger;
            this.$location = $location;
            this.$state = $state;
            this.modal = modal;
            this.$translate = $translate;
            this.drinkResource = drinkResource;
            this.edit = edit;
            this.logger.info("DrinkEditController called with client-url: " + $location.path());
            this.drink = angular.copy(drinkResource);
        }
        DrinkDetailsController.prototype.canDelete = function () {
            return this.drinkResource ? this.drinkResource.$has("delete") : false;
        };
        DrinkDetailsController.prototype.canEdit = function () {
            return this.drinkResource ? this.drinkResource.$has("update") : false;
        };
        DrinkDetailsController.prototype.save = function () {
            var _this = this;
            if (this.drinkForm.$valid) {
                this.drinkResource.$put("update", {}, this.drink).then(function (res) {
                    _this.$state.go("^", {}, { reload: true })
                        .then(function (res) {
                        _this.logger.info("The drink has been updated!", null, enums.LogOptions.toast);
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
        DrinkDetailsController.prototype.cancel = function () {
            this.$state.go("^", {}, { reload: true });
        };
        DrinkDetailsController.prototype.deleteDrink = function () {
            var _this = this;
            var headerText = this.$translate.instant("dialog.deleteDrink.header", { value: this.drink.name });
            var bodyText = this.$translate.instant("dialog.deleteDrink.body", { value: this.drink.name });
            var modalOptions = {
                headerText: headerText,
                bodyText: bodyText,
                closeButtonText: "dialog.deleteDrink.btn.cancel",
                actionButtonText: "dialog.deleteDrink.btn.delete",
                glyph: "glyphicon glyphicon-trash",
            };
            this.modal.showModal({}, modalOptions)
                .then(function (res) {
                _this.drinkResource.$del("delete")
                    .then(function (res) {
                    _this.$state.go(constants.STATES.drinks.list, null, { reload: true })
                        .then(function (res) {
                        _this.logger.info("The drink has been deleted!", null, enums.LogOptions.toast);
                    });
                })
                    .catch(function (err) {
                    try {
                        _this.logger.error(err.data.name, err.data.message, enums.LogOptions.toast);
                    }
                    catch (e) {
                        _this.logger.error("Error", err, enums.LogOptions.toast);
                    }
                });
            });
        };
        DrinkDetailsController.prototype.editDrink = function () {
            this.$state.go(constants.STATES.drinks.edit, "", { reload: true });
        };
        DrinkDetailsController.prototype.isSelected = function () {
            return this.$state.includes(constants.STATES.drinks.details) && this.drinkResource;
        };
        DrinkDetailsController.$inject = [
            injections.services.loggerService,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.modalService,
            injections.angular.$translateService,
            "drinkResource",
            "edit"
        ];
        return DrinkDetailsController;
    })();
    controllers.DrinkDetailsController = DrinkDetailsController;
})(controllers || (controllers = {}));
//# sourceMappingURL=drink-details.controller.js.map