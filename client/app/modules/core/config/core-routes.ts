///<reference path="../../../../typings/tsd.d.ts" />

module client {
    "use strict";

    angular.module("core").config(["$stateProvider", "$urlRouterProvider",
        ($stateProvider, $urlRouterProvider) => {
            // Redirect to home view when route not found
            $urlRouterProvider.otherwise("/");

            // Home state routing
            $stateProvider.
                state("home", {
                    url: "/",
                    templateUrl: "modules/core/views/home.html"
                });
        }
    ]);
}