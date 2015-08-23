///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />

module engine {
    "use strict";

    angular.module("engine").config(($stateProvider) => {
            $stateProvider.state("home.engine", {
                url: "/engine",
                views: {
                    "@home": {
                        templateUrl: "modules/engine/views/engine.html",
                        controller: "EngineController",
                        controllerAs: "vm",
                    }
                },
            })
        }
    );
}