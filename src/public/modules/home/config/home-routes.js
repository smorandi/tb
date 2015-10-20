///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../home-module.ts" />
var home;
(function (home) {
    "use strict";
    angular.module("home").config(["$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            // Home state routing
            $stateProvider.
                state("root.home", {
                abstract: true,
                url: "/home",
                templateUrl: "modules/home/views/home.html",
                controller: "HomeController",
                controllerAs: "vm",
                resolve: {
                    homeResource: function ($log, rootResource) {
                        if (!rootResource.$has("home")) {
                            $log.info("no home link found. returning empty array...");
                            return [];
                        }
                        $log.info("resolving home-resource...");
                        var x = rootResource.$get("home").then(function (res) {
                            $log.info("drinks-resource resolved...");
                            return res;
                        });
                        return x;
                    }
                }
            });
        }
    ]);
})(home || (home = {}));
//# sourceMappingURL=home-routes.js.map