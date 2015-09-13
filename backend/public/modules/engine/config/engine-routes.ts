///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />

module engine {
    "use strict";

    angular.module("engine").config(($stateProvider) => {
            $stateProvider.state("home.engine", {
                url: "engine",
                views: {
                    "@home": {
                        templateUrl: "modules/engine/views/engine.html",
                        controller: "EngineController",
                        controllerAs: "vm",
                    }
                },
                resolve: {
                    engineResource: ($log, homeResource) => {
                        $log.info("resolving engine-resource...");
                        return homeResource.$get("engine").then(res => {
                            $log.info("drinks-resource resolved...");
                            return res;
                        });
                    },
                },
            })
        }
    );
}