///<reference path="../../../../all.references.ts" />

"use strict";

module controllers {
    export class DrinkDetailsController {
        public drink:any;
        public drinkForm:ng.IFormController;

        static $inject = [
            injections.services.loggerService,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.modalService,
            injections.angular.$translateService,
            "drinkResource",
            "edit"
        ];

        constructor(private logger:services.LoggerService,
                    private $location:ng.ILocationService,
                    private $state:ng.ui.IStateService,
                    private modal:services.ModalService,
                    private $translate:ng.translate.ITranslateService,
                    private drinkResource,
                    private edit:boolean = false) {
            this.logger.info("DrinkEditController called with client-url: " + $location.path());

            // clone it, so we can edit it without changing the original...
            this.drink = angular.copy(drinkResource);
        }

        public canDelete():void {
            return this.drinkResource ? this.drinkResource.$has("delete") : false;
        }

        public canEdit():void {
            return this.drinkResource ? this.drinkResource.$has("update") : false;
        }

        public save():void {
            if (this.drinkForm.$valid) {
                this.drinkResource.$put("update", {}, this.drink).then(res => {
                    this.$state.go("^", {}, {reload: true})
                        .then(res=> {
                            this.logger.info("The drink has been updated!", null, enums.LogOptions.toast);
                        });
                }).catch(err => {
                    try {
                        this.logger.error(err.data.name, err.data.message, enums.LogOptions.toast);
                    } catch (e) {
                        this.logger.error("Error", err, enums.LogOptions.toast);
                    }
                });
            }
        }

        public cancel():void {
            this.$state.go("^", {}, {reload: true});
        }

        public deleteDrink():void {
            var headerText = this.$translate.instant("dialog.deleteDrink.header", {value: this.drink.name});
            var bodyText = this.$translate.instant("dialog.deleteDrink.body", {value: this.drink.name});
            var modalOptions = {
                headerText: headerText,
                bodyText: bodyText,
                closeButtonText: "dialog.deleteDrink.btn.cancel",
                actionButtonText: "dialog.deleteDrink.btn.delete",
                glyph: "glyphicon glyphicon-trash",
            };


            this.modal.showModal({}, modalOptions)
                .then(res => {
                    this.drinkResource.$del("delete")
                        .then(res => {
                            this.$state.go(constants.STATES.drinks.list, null, {reload: true})
                                .then(res => {
                                    this.logger.info("The drink has been deleted!", null, enums.LogOptions.toast);
                                });
                        })
                        .catch(err => {
                            try {
                                this.logger.error(err.data.name, err.data.message, enums.LogOptions.toast);
                            } catch (e) {
                                this.logger.error("Error", err, enums.LogOptions.toast);
                            }
                        });
                });
        }

        public editDrink() {
            this.$state.go(constants.STATES.drinks.edit, "", {reload: true});
        }

        public isSelected():boolean {
            return this.$state.includes(constants.STATES.drinks.details) && this.drinkResource;
        }
    }
}