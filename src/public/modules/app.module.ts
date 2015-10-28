///<reference path="../all.references.ts" />

module modules {
    "use strict";

    angular.module("app", ["ui.router", "mgcrea.ngStrap", "drinks", "dashboard", "system", "angular-hal", "btford.socket-io"])
        .factory(injections.services.apiService, (halClient, $log) => {
            return new services.ApiService(halClient, $log);
        })
        .factory(injections.services.socketService, (socketFactory, $log) => {
            return new services.SocketService(socketFactory, $log);
        })
        .factory(injections.services.utilsService, ($window) => {
            return new services.UtilsService($window);
        })
        .factory(injections.services.dashboardService, (apiService, socketService, $log) => {
            return new services.DashboardService(apiService, socketService, $log);
        })
        .factory(injections.services.authService, ($window, $log) => {
            return new services.AuthService($window, $log);
        })
        .factory(injections.services.linkService, ($log, $state) => {
            return new services.LinkService($log, $state);
        })
        .factory(injections.services.menuService, ($log, $state, authService, linkService) => {
            return new services.MenuService($log, $state, authService, linkService);
        })
        .factory("myHttpInterceptor", ($q, authService:services.AuthService) => {
            return {
                // optional method
                "request": config => {
                    // do something on success
                    if (authService.getToken()) {
                        config.headers.Authorization = "Basic " + authService.getToken();
                    }

                    return config;
                },

                // optional method
                "requestError": rejection => {
                    // do something on error
                    return $q.reject(rejection);
                },
                // optional method
                "response": response => {
                    // do something on success
                    return response;
                },
                "responseError": rejection => {
                    // do something on error
                    return $q.reject(rejection);
                }
            };
        })
        .directive(injections.directives.header, directives.HeaderDirective)
        .config(["$httpProvider", $httpProvider => {
            $httpProvider.interceptors.push("myHttpInterceptor");
        }])
        .run(($log, $rootScope, $state, utilsService:services.UtilsService, authService:services.AuthService) => {
            $rootScope.$on("$stateChangeStart",
                (event, toState, toParams, fromState, fromParams) => {
                    $log.info("transition: " + fromState.name + " -> " + toState.name);
                    //if (toState.redirectTo) {
                    //    $log.info("redirectTo: " + toState.redirectTo);
                    //    event.preventDefault();
                    //    $state.go(toState.redirectTo, toParams)
                    //}
                });
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (toState.redirectTo) {
                        $log.info("redirectTo: " + toState.redirectTo);
                        $state.go(toState.redirectTo, toParams)
                    }
                });
            $rootScope.$on("$stateChangeError",
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
            $rootScope.$on("$stateNotFound",
                (event, unfoundState, fromState, fromParams) => {
                    $log.error("$stateNotFound: " + fromState.name + " -> " + unfoundState.to);
                    utilsService.alert("$stateNotFound\n" + fromState.name + " -> " + unfoundState.to);
                });
        });
}