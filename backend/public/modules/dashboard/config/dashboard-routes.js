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
                    controllerAs: "vm"
                }
            },
            resolve: {
                dashboard: function ($log, homeResource) {
                    $log.info("resolving dashboard...");
                    if (homeResource.$has("dashboard")) {
                        return homeResource.$get("dashboard").then(function (res) {
                            $log.info("dashboard resolved...");
                            return res;
                        });
                    }
                    else {
                        $log.info("no dashboard found. returning empty null...");
                        return null;
                    }
                }
            }
        });
    });
})(home || (home = {}));
//# sourceMappingURL=dashboard-routes.js.map