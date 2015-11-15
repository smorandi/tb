///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class LoggerService implements interfaces.ILogger {

        static $inject = [
            injections.angular.$log,
            injections.extServices.toaster
        ];

        constructor(private $log:angular.ILogService,
                    private toaster:ngtoaster.IToasterService) {
        }

        private toLogString(title:string, message:string):string {
            var logString = title ? title : "";
            logString += message ? "-" + message : "";
            return logString;
        }

        public debug(title:string, message?:string, logOptions?:enums.LogOptions) {
            if (logOptions === enums.LogOptions.toast_only) {
                this.toaster.pop(constants.TOASTER.info, title, message);
            }
            else if (logOptions === enums.LogOptions.toast) {
                this.toaster.pop(constants.TOASTER.info, title, message);
                this.$log.debug(this.toLogString(title, message));
            }
            else {
                this.$log.debug(this.toLogString(title, message));
            }
        }

        public info(title:string, message?:string, logOptions?:enums.LogOptions) {
            if (logOptions === enums.LogOptions.toast_only) {
                this.toaster.info(title, message);
            }
            else if (logOptions === enums.LogOptions.toast) {
                this.toaster.info(title, message);
                this.$log.info(this.toLogString(title, message));
            }
            else {
                this.$log.info(this.toLogString(title, message));
            }
        }

        public warn(title:string, message?:string, logOptions?:enums.LogOptions) {
            if (logOptions === enums.LogOptions.toast_only) {
                this.toaster.warning(title, message);
            }
            else if (logOptions === enums.LogOptions.toast) {
                this.toaster.warning(title, message);
                this.$log.warn(this.toLogString(title, message));
            }
            else {
                this.$log.warn(this.toLogString(title, message));
            }
        }

        public error(title:string, message?:string, logOptions?:enums.LogOptions) {
            if (logOptions === enums.LogOptions.toast_only) {
                this.toaster.error(title, message);
            }
            else if (logOptions === enums.LogOptions.toast) {
                this.toaster.error(title, message);
                this.$log.error(this.toLogString(title, message));
            }
            else {
                this.$log.error(this.toLogString(title, message));
            }
        }
    }
}