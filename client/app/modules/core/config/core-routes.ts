///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../core-module.ts" />

module core {
    "use strict";

    angular.module("core").config(["$stateProvider", "$urlRouterProvider",
        ($stateProvider, $urlRouterProvider) => {
            // Redirect to home view when route not found
            $urlRouterProvider.otherwise("");

            // Home state routing
            $stateProvider.
                state("home", {
                    url: "",
                    templateUrl: "modules/core/views/home.html",
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
                    }
                });
        }
    ]);
}