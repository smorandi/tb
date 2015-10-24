///<reference path="../all.references.ts" />

module modules {
    "use strict";

    angular.module("app", ["ui.router", "mgcrea.ngStrap", "drinks", "dashboard", "system", "angular-hal", "btford.socket-io"])
        .factory("apiService", (halClient, $log) => {
            return new services.ApiService(halClient, $log);
        })
        .factory("socketService", (socketFactory, $log) => {
            return new services.SocketService(socketFactory, $log);
        })
        .factory("utilsService", ($window) => {
            return new services.UtilsService($window);
        })
        .factory("dashboardService", (apiService, socketService, $log) => {
            return new services.DashboardService(apiService, socketService, $log);
        })
        .factory("authService", ($window, $log) => {
            return new services.AuthService($window, $log);
        })
        .factory("pageService", $log => {
            return new services.PageService($log);
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
        .config(["$httpProvider", $httpProvider => {
            $httpProvider.interceptors.push("myHttpInterceptor");
        }])
        .directive("header", directives.HeaderDirective)
        .run(($log, $rootScope, $injector, utilsService:services.UtilsService, authService:services.AuthService) => {
            $rootScope.$on("$stateChangeStart",
                (event, toState, toParams, fromState, fromParams) => {
                    $log.info("transition: " + fromState.name + " -> " + toState.name);
                });
            $rootScope.$on("$stateChangeError",
                (event, toState, toParams, fromState, fromParams, error) => {
                    $log.error("$stateChangeError: " + fromState.name + " -> " + toState.name);

                    if (error.status === 401) {
                        utilsService.alert("NOT Authorized! calling with token now...");
                        authService.setToken("admin", "admin");
                        $injector.get("$state").go(toState, toParams, {relative: fromState});
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