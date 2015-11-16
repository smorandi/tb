///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class SystemController {
        static $inject = [injections.services.loggerService, injections.angular.$location, "systemResource"];

        constructor(private logger:services.LoggerService, private $location:ng.ILocationService, private systemResource) {
            this.logger.info("SystemController called with client-url: " + $location.path());
        }

        public replay():void {
            this.systemResource.$post("replay", {}, {}).then(res => {
                this.logger.info("Events replayed", null, enums.LogOptions.toast);
            }).catch(err => {
                this.logger.error("Replay failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        }

        public reinitialize():void {
            this.systemResource.$post("reInitialize", {}, {}).then(res => {
                this.systemResource = res;
                this.logger.info("Re-Initialized", null, enums.LogOptions.toast);
            }).catch(err => {
                this.logger.error("Re-Initialization failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        }

        public startEngine():void {
            this.systemResource.$put("startEngine", {}, {}).then(res => {
                this.systemResource = res;
                this.logger.info("Engine started", null, enums.LogOptions.toast);
            }).catch(err => {
                this.logger.error("Engine start failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        }

        public stopEngine():void {
            this.systemResource.$put("stopEngine", {}, {}).then(res => {
                this.systemResource = res;
                this.logger.info("Engine stopped", null, enums.LogOptions.toast);
            }).catch(err => {
                this.logger.error("Engine stop failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        }
    }
}
