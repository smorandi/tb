///<reference path="../../all.references.ts" />

"use strict";

module run {
    export class Run {
        static $inject = [
            injections.angular.$log,
            injections.angular.$rootScope,
            injections.uiRouter.$stateService,
            injections.services.authService,
            injections.services.utilsService,
            injections.bootstrap.uibModal,
            injections.services.loggerService
        ];

        constructor($log:ng.ILogService,
                    $rootScope:ng.IRootScopeService,
                    $state:ng.ui.IStateService,
                    authService:services.AuthService,
                    utilsService:services.UtilsService,
                    $uibModal:angular.ui.bootstrap.IModalService,
                    LoggerService:services.LoggerService) {
            $rootScope.$on(injections.rootScope.$stateChangeStart,
                (event, toState, toParams, fromState, fromParams) => {
                    $log.info("transition: " + fromState.name + " -> " + toState.name);
                });
            $rootScope.$on(injections.rootScope.$stateChangeSuccess,
                function (event, toState, toParams, fromState, fromParams) {
                    if (toState.redirectTo) {
                        $log.info("redirectTo: " + toState.redirectTo);
                        $state.go(toState.redirectTo, toParams)
                    }
                });
            $rootScope.$on(injections.rootScope.$stateChangeError,
                (event, toState, toParams, fromState, fromParams, error) => {
                    $log.error("$stateChangeError: " + fromState.name + " -> " + toState.name);

                    //@TODO 403 message
                    if (error.status === 401) {

                        LoggerService.ToastError("not authorized", "forbidden");

                        var modalInst = $uibModal.open({
                            controller: controllers.AuthDialogController,
                            controllerAs: "vm",
                            templateUrl: 'components/authentification/authDialog.html',
                        });

                        modalInst.result.then(function (user) {
                            authService.setCredentials(new models.Credentials(user.name, user.pw));
                            $state.go(toState, toParams, {relative: fromState});

                        }, function () {
                            $state.go(fromState);
                        });
                    }
                    else {
                        utilsService.alert(error);
                    }
                });
            $rootScope.$on(injections.rootScope.$stateNotFound,
                (event, unfoundState, fromState, fromParams) => {
                    $log.error("$stateNotFound: " + fromState.name + " -> " + unfoundState.to);
                    utilsService.alert("$stateNotFound\n" + fromState.name + " -> " + unfoundState.to);
                });

        }
    }
}