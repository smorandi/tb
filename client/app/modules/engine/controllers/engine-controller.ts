///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />

module engine {
    "use strict";

    class EngineController {
        private drinks:Array<any>;

        public static $inject = ["$log", "$location", "$scope", "$state", "$stateParams", "apiService", "utilsService", "socketService", "engineResource"];
        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private apiService:home.ApiService, private utilsService:home.UtilsService, private socketService:any, private engineResource) {
            $log.info("EngineController called with client-url: " + $location.path());

            socketService.on("newPrices", data => {
                console.log("EngineController --> " + JSON.stringify(data));
                this.drinks = data;
            });
        }

        public activateEngine():void {
            this.engineResource.$put("activate", {}, {}).then(res => {
                this.engineResource = res;
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }

        public deactivateEngine():void {
            this.engineResource.$put("deactivate", {}, {}).then(res => {
                this.engineResource = res;
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }
    }

    angular.module("engine").controller("EngineController", EngineController);
}
