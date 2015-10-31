///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class AuthDialogController {

        user = {};
        private mdDialog;

        static $inject = [
            injections.angular.$log,
            injections.bootstrap.uibModalInst
            ];

        constructor( private $log:ng.ILogService, private  $uibModalInstance:angular.ui.bootstrap.IModalServiceInstance ) {
            $log.info("authDialog");
            this.user = {
                name : "",
                pw: ""
            };
            this.mdDialog = $uibModalInstance;
        }

        public cancel(): void {
            this.mdDialog.dismiss('cancel');
        }

        public auth() {
            this.mdDialog.close(this.user);
        }

    }
}