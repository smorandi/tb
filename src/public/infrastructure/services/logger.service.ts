///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class LoggerService implements interfaces.ILogger {

        constructor( private $log: angular.ILogService) {
            toastr.options.timeOut = 4000;
            toastr.options.showDuration = 1000;
            toastr.options.hideDuration = 1000;
            toastr.options.positionClass = "toast-top-center";
            toastr.options.closeButton = true;

        }

        public logWarning(message:string, id:string, title:string): void {

        }

        public logInfo(message:string, id:string, title:string): void {

        }

        public logError(message:string, id:string, title:string): void {

        }

        public ToastWarning(message:string, title:string): void {
            toastr.warning(message, title);
        }

        public ToastInfo(message:string, title:string): void {
            toastr.info(message, title);
        }

        public ToastError(message:string, title:string): void {
            toastr.error(message, title);
        }

    }
}