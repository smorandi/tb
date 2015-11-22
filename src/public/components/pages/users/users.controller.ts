///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class UsersController {
        private users:Array<any> = [];

        private selectedOriginalUser:any;
        private user:any = null;
        private userForm:ng.IFormController;
        private isEdit:boolean = false;

        static $inject = [
            injections.services.loggerService,
            injections.angular.$translateService,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            injections.services.modalService,
            "usersResource"];

        constructor(private logger:services.LoggerService,
                    private $translate:ng.translate.ITranslateService,
                    private $state:ng.ui.IStateService,
                    private utils:services.UtilsService,
                    private modal:services.ModalService,
                    private usersResource) {
            this.logger.info("UsersController created");
            usersResource.$get("items").then(items => {
                this.users.length = 0;
                Array.prototype.push.apply(this.users, items);
            });
        }

        public showDetails(user:any):void {
            this.selectedOriginalUser = user;
            this.user = user;
            this.isEdit = false;
        }

        public edit():void {
            this.user = angular.copy(this.selectedOriginalUser);
            this.isEdit = true;
        }

        public cancel():void {
            this.isEdit = false;
            this.user = this.selectedOriginalUser;
        }

        public save():void {
            if (this.userForm.$valid && this.isEdit) {
                this.selectedOriginalUser.$put("update", {}, this.user)
                    .then(res => {
                        this.utils.replaceInArray(this.users, "id", res.id, res);
                        this.showDetails(res);
                    })
                    .catch(err => {
                        this.logger.error("Change Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                    });
            }
        }

        public unregister():void {
            var headerText = this.$translate.instant("dialog.unregister.header", {value: this.user.loginname});
            var bodyText = this.$translate.instant("dialog.unregister.body", {value: this.user.loginname});
            var modalOptions = {
                headerText: headerText,
                bodyText: bodyText,
                closeButtonText: "dialog.unregister.btn.cancel",
                actionButtonText: "dialog.unregister.btn.unregister",
                glyph: "glyphicon glyphicon-trash",
            };

            this.modal.showModal({}, modalOptions)
                .then(res => {
                    this.selectedOriginalUser.$del("delete")
                        .then(res => {
                            this.utils.removeFromArray(this.users, "id", this.user.id);
                            this.showDetails(null);
                        })
                        .catch(err => {
                            this.logger.error("Unregister Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                        });
                });
        }
    }
}
