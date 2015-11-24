///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class SystemController {
        private status:string = "";
        private isRunning:boolean = false;
        private system = new models.SystemProperties();
        private systemForm:ng.IFormController;
        private isEdit:boolean = false;


        static $inject = [
            injections.services.loggerService,
            injections.uiRouter.$stateService,
            injections.services.localStorageService,
            "systemResource"];

        constructor(private logger:services.LoggerService,
                    private $state:ng.ui.IStateService,
                    private localStore:services.LocalStorageService,
                    private systemResource) {
            this.logger.info("SystemController created");
            this.setSystemResource(systemResource);
        }

        private setSystemResource(resource:any):void {
            this.systemResource = resource;
            _.assign(this.system, _.pick(this.systemResource, _.keys(this.system)));
            this.isRunning = this.systemResource.status === "running";
            this.status = this.isRunning ? "engine.status.running" : "engine.status.idle";
        }

        public clearLocalStore():void {
            this.localStore.clearAll();
            this.logger.info("Local Store cleared", null, enums.LogOptions.toast);
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
                this.setSystemResource(res);
                this.logger.info("Re-Initialized", null, enums.LogOptions.toast);
            }).catch(err => {
                this.logger.error("Re-Initialization failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        }

        public startEngine():void {
            this.systemResource.$put("startEngine", {}, {}).then(res => {
                this.setSystemResource(res);
                this.logger.info("Engine started", null, enums.LogOptions.toast);
            }).catch(err => {
                this.logger.error("Engine start failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        }

        public stopEngine():void {
            this.systemResource.$put("stopEngine", {}, {}).then(res => {
                this.setSystemResource(res);
                this.logger.info("Engine stopped", null, enums.LogOptions.toast);
            }).catch(err => {
                this.logger.error("Engine stop failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
            });
        }

        public edit():void {
            this.isEdit = true;
        }

        public cancel():void {
            this.$state.reload();
        }

        public save():void {
            if (this.systemForm.$valid && this.isEdit) {
                this.systemResource.$put("update", {}, this.system)
                    .then(res => {
                        this.$state.reload()
                            .then(res => {
                                this.logger.info("System Changed", "", enums.LogOptions.toast);
                            })
                            .catch(err => {
                                this.logger.error("Sign-Up Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                            });
                    })
                    .catch(err => {
                        this.logger.error("Change Failed", JSON.stringify(err, undefined, 2), enums.LogOptions.toast);
                    });
            }
        }
    }
}
