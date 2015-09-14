///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />

module engine {
    "use strict";

    angular.module("admin").config(($stateProvider) => {
            $stateProvider.state("home.admin", {
                url: "admin",
                views: {
                    "@home": {
                        templateUrl: "modules/admin/views/admin.html",
                        controller: "AdminController",
                        controllerAs: "vm",
                    }
                },
                resolve: {
                    adminResource: ($log, homeResource) => {
                        $log.info("resolving admin-resource...");
                        return homeResource.$get("admin").then(res => {
                            $log.info("admin-resource resolved...");
                            return res;
                        });
                    },
                },
            })
        }
    );
}