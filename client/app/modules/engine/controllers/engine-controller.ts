///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />

module engine {
    "use strict";

    class EngineController {
        public static $inject = ["$log", "$location", "$scope", "$state", "$stateParams", "apiService", "utilsService", "socketService"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private apiService:home.ApiService, private utilsService:home.UtilsService, private socketService:any) {
            $log.info("EngineController called with client-url: " + $location.path());


            socketService.on("newPrices", data => {
                console.log("EngineController --> " + JSON.stringify(data));
            });
        }


    }

    angular.module("engine").controller("EngineController", EngineController);
}
