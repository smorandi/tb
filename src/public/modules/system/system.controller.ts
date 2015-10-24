///<reference path="../../all.references.ts" />

module modules {
    "use strict";

    class SystemController {
        private alerts = [];

        public static $inject = ["$log", "$location", "$scope", "$state", "$stateParams", "$document", "apiService", "utilsService", "systemResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private $document:ng.IDocumentService, private apiService:services.ApiService, private utilsService:services.UtilsService, private systemResource) {
            $log.info("SystemController called with client-url: " + $location.path());
        }

        public addAlert(msg:string) {
            this.alerts.push({type: "success", msg: msg});
        }

        public replay():void {
            this.systemResource.$post("replay", {}, {}).then(res => {
                //this.$state.reload();
                this.addAlert("Replay successful");
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }

        public startEngine():void {
            this.systemResource.$put("startEngine", {}, {}).then(res => {
                this.systemResource = res;
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }

        public stopEngine():void {
            this.systemResource.$put("stopEngine", {}, {}).then(res => {
                this.systemResource = res;
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }
    }

    angular.module("system").controller("SystemController", SystemController);
}
