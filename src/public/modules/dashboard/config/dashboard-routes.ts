///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../dashboard-module.ts" />

module home {
    "use strict";

    angular.module("dashboard").config(($stateProvider) => {
            $stateProvider.state("home.dashboard", {
                url: "dashboard",
                views: {
                    "@home": {
                        templateUrl: "modules/dashboard/views/dashboard.html",
                        controller: "DashboardController",
                        controllerAs: "vm",
                    }
                },
                resolve: {
                    //dashboard: ($log, homeResource) => {
                    //    $log.info("resolving dashboard...");
                    //    if (homeResource.$has("dashboard")) {
                    //        return homeResource.$get("dashboard").then(res => {
                    //            $log.info("dashboard resolved...");
                    //            return res;
                    //        });
                    //    }
                    //    else {
                    //        $log.info("no dashboard found. returning empty null...");
                    //        return null;
                    //    }
                    //},
                },
            })
        }
    );
}