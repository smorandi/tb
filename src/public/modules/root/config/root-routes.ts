///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../root-module.ts" />

module home {
    "use strict";

    angular.module("root").config(["$stateProvider", "$urlRouterProvider",
        ($stateProvider, $urlRouterProvider) => {
            // Redirect to home view when route not found
            $urlRouterProvider.otherwise("/dashboard");

            // Home state routing
            $stateProvider.
                state("root", {
                    abstract: true,
                    url: "",
                    templateUrl: "modules/root/views/root.html",
                    controller: "RootController",
                    controllerAs: "vm",
                    resolve: {
                        apiService: "apiService",
                        rootResource: function ($log, apiService:ApiService) {
                            $log.info("resolving root-resource...");
                            return apiService.$load().then(res => {
                                $log.info("root-resource resolved...");
                                return res;
                            });
                        }
                    },
                });
        }
    ]);
}