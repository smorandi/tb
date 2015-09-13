///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../home-module.ts" />
var home;
(function (home) {
    "use strict";
    angular.module("home").config(["$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
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
                    homeResource: function ($log, apiService) {
                        $log.info("resolving home-resource...");
                        return apiService.$load().then(function (res) {
                            $log.info("home-resource resolved...");
                            return res;
                        });
                    }
                }
            });
        }
    ]);
})(home || (home = {}));
//# sourceMappingURL=home-routes.js.map