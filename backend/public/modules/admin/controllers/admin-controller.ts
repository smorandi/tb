///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../home/home-module.ts" />
"use strict";

module engine {
    class AdminController {
        private drinks:Array<any>;
        private alerts = [];

        public static $inject = ["$log", "$location", "$scope", "$state", "$stateParams", "$document", "apiService", "utilsService", "adminResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $scope:ng.IScope, private $state:ng.ui.IStateService, private $stateParams:ng.ui.IStateParamsService, private $document:ng.IDocumentService, private apiService:home.ApiService, private utilsService:home.UtilsService, private adminResource) {
            $log.info("AdminController called with client-url: " + $location.path());
        }

        public addAlert(msg:string) {
            this.alerts.push({type:"success", msg: msg});
        }

        public replay():void {
            this.adminResource.$post("replay", {}, {}).then(res => {
                //this.$state.reload();
                this.addAlert("Replay successful");
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }

        public activateEngine():void {
            this.adminResource.$put("activate", {}, {}).then(res => {
                this.adminResource = res;
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }

        public deactivateEngine():void {
            this.adminResource.$put("deactivate", {}, {}).then(res => {
                this.adminResource = res;
            }).catch(err => {
                this.utilsService.alert(JSON.stringify(err, undefined, 2));
            });
        }
    }

    angular.module("admin").controller("AdminController", AdminController);
}
