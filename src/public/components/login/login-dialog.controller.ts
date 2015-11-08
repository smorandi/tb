///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class LoginDialogController {
        public credentials:interfaces.ICredentials = new models.Credentials();

        static $inject = [
            injections.services.loggerService,
            injections.bootstrap.uibModalInst
        ];

        constructor(private logger:services.LoggerService,
                    private $uibModalInstance:angular.ui.bootstrap.IModalServiceInstance) {
            logger.info("authDialog");
        }

        public cancel():void {
            this.$uibModalInstance.dismiss('cancel');
        }

        public login() {
            this.$uibModalInstance.close(this.credentials);
        }
    }
}