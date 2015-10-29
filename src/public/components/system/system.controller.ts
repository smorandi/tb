///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class SystemController {
        private alerts = [];

        static $inject = [injections.angular.$log, injections.angular.$location, injections.services.utilsService, "systemResource"];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private utilsService:services.UtilsService, private systemResource) {
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
}
