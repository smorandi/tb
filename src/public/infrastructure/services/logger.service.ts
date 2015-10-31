///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class LoggerService implements interfaces.ILogger {

        static $inject = [injections.angular.$log, injections.extServices.toaster];

        constructor( private $log: angular.ILogService, private toaster:ngtoaster.IToasterService) {
        }

        public logWarning(message:string, id:string, title:string): void {

        }

        public logInfo(message:string, id:string, title:string): void {

        }

        public logError(message:string, id:string, title:string): void {

        }

        public ToastWarning(message:string, title:string): void {
            this.toastr.warning(message, title);
        }

        public ToastInfo(message:string, title:string): void {
            this.toaster.info(message, title);
        }

        public ToastError(message:string, title:string): void {
            this.toaster.error(message, title);
        }

    }
}