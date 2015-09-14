///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />
var engine;
(function (engine) {
    "use strict";
    angular.module("admin").config(function ($stateProvider) {
        $stateProvider.state("home.admin", {
            url: "admin",
            views: {
                "@home": {
                    templateUrl: "modules/admin/views/admin.html",
                    controller: "AdminController",
                    controllerAs: "vm"
                }
            },
            resolve: {
                adminResource: function ($log, homeResource) {
                    $log.info("resolving admin-resource...");
                    return homeResource.$get("admin").then(function (res) {
                        $log.info("admin-resource resolved...");
                        return res;
                    });
                }
            }
        });
    });
})(engine || (engine = {}));
//# sourceMappingURL=admin-routes.js.map