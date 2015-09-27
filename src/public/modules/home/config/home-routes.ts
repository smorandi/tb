///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../home-module.ts" />

module home {
    "use strict";

    angular.module("home").config(["$stateProvider", "$urlRouterProvider",
        ($stateProvider, $urlRouterProvider) => {
            // Redirect to home view when route not found
            $urlRouterProvider.otherwise("/dashboard");

            // Home state routing
            $stateProvider.
                state("home", {
                    abstract: true,
                    url: "/",
                    templateUrl: "modules/home/views/home.html",
                    controller: "HomeController",
                    controllerAs: "vm",
                    resolve: {
                        apiService: "apiService",
                        homeResource: function ($log, apiService:ApiService) {
                            $log.info("resolving home-resource...");
                            return apiService.$load().then(res => {
                                $log.info("home-resource resolved...");
                                return res;
                            });
                        }
                    },
                });
        }
    ]);
}