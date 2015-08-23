///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />
var engine;
(function (engine) {
    "use strict";
    angular.module("engine").config(function ($stateProvider) {
        $stateProvider.state("home.engine", {
            url: "/engine",
            views: {
                "@home": {
                    templateUrl: "modules/engine/views/engine.html",
                    controller: "EngineController",
                    controllerAs: "vm"
                }
            }
        });
    });
})(engine || (engine = {}));
//# sourceMappingURL=engine-routes.js.map