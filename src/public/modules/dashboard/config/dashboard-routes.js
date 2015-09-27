///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../dashboard-module.ts" />
var home;
(function (home) {
    "use strict";
    angular.module("dashboard").config(function ($stateProvider) {
        $stateProvider.state("home.dashboard", {
            url: "dashboard",
            views: {
                "@home": {
                    templateUrl: "modules/dashboard/views/dashboard.html",
                    controller: "DashboardController",
                    controllerAs: "vm",
                }
            },
            resolve: {},
        });
    });
})(home || (home = {}));
//# sourceMappingURL=dashboard-routes.js.map