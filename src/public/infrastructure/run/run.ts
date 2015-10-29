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
        ];

        constructor($log:ng.ILogService, $rootScope:ng.IRootScopeService, $state:ng.ui.IStateService, authService:services.AuthService, utilsService:services.UtilsService) {
            $rootScope.$on(injections.rootScope.$stateChangeStart,
                (event, toState, toParams, fromState, fromParams) => {
                    $log.info("transition: " + fromState.name + " -> " + toState.name);
                    //if (toState.redirectTo) {
                    //    $log.info("redirectTo: " + toState.redirectTo);
                    //    event.preventDefault();
                    //    $state.go(toState.redirectTo, toParams)
                    //}
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

                    if (error.status === 401) {
                        utilsService.alert("NOT Authorized! calling with token now...");
                        authService.setToken("admin", "admin");
                        $state.go(toState, toParams, {relative: fromState});
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