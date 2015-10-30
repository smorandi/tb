///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class AuthDialogController {

        user = {};
        private mdDialog;

        static $inject = [
            injections.angular.$log,
            injections.material.matDialog
            ];

        constructor( private $log:ng.ILogService, private $mdDialog:angular.material.IDialogService ) {
            $log.info("authDialog");
            this.user = {
                name : "",
                pw: ""
            };
            this.mdDialog = $mdDialog;
        }

        public hide():void {
            this.mdDialog.hide();
        }

        public cancel(): void {
            this.mdDialog.cancel();
        }

        public auth() {
            this.mdDialog.hide(this.user);
        }

    }
}