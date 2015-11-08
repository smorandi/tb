///<reference path="../../all.references.ts" />

"use strict";

module run {
    export var onLoggingIn:boolean = false;

    export class Run {

        static $inject = [
            injections.services.loggerService,
            injections.angular.$rootScope,
            injections.uiRouter.$stateService,
            injections.services.authService,
            injections.services.utilsService,
            injections.bootstrap.uibModal
        ];

        constructor(logger:services.LoggerService,
                    $rootScope:ng.IRootScopeService,
                    $state:ng.ui.IStateService,
                    authService:services.AuthService,
                    utilsService:services.UtilsService,
                    $uibModal:angular.ui.bootstrap.IModalService) {
            $rootScope.$on(injections.rootScope.$stateChangeStart,
                (event, toState, toParams, fromState, fromParams) => {
                    logger.info("transition: " + fromState.name + " -> " + toState.name);
                });
            $rootScope.$on(injections.rootScope.$stateChangeSuccess,
                function (event, toState, toParams, fromState, fromParams) {
                    if (toState.redirectTo) {
                        logger.info("redirectTo: " + toState.redirectTo);
                        $state.go(toState.redirectTo, toParams)
                    }
                });
            $rootScope.$on(injections.rootScope.$stateChangeError,
                (event, toState, toParams, fromState, fromParams, error) => {
                    logger.error("$stateChangeError: " + fromState.name + " -> " + toState.name);

                    //@TODO 403 message
                    if (error.status === 401) {

                        logger.error("not authorized - doing a login");

                        var modalInst = $uibModal.open({
                            controller: controllers.LoginDialogController,
                            controllerAs: "vm",
                            templateUrl: 'components/login/login-dialog.html',
                        });

                        modalInst.result.then((credentials:interfaces.ICredentials) => {
                            onLoggingIn = true;
                            authService.setCredentials(new models.Credentials(credentials.loginname, credentials.password));
                            $state
                                .go(toState, toParams, {relative: fromState})
                                .then(() => {
                                    logger.info("Login successful", "Welcome " + authService.getCredentials().loginname, enums.LogOptions.toast_only);
                                })
                                .catch(err => {
                                    logger.error("Login failed", "the provided credentials are invalid", enums.LogOptions.toast);
                                });
                        }, () => {
                            $state.go(fromState);
                        });
                    }
                    else {
                        logger.error("", error, enums.LogOptions.toast);
                    }
                });
            $rootScope.$on(injections.rootScope.$stateNotFound,
                (event, unfoundState, fromState, fromParams) => {
                    logger.error("$stateNotFound: " + fromState.name + " -> " + unfoundState.to, "", enums.LogOptions.toast);
                });

        }
    }
}