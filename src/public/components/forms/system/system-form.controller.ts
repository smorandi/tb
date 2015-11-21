///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class SystemForm {
        static $inject = [
            injections.services.loggerService
        ];

        constructor(private logger:services.LoggerService) {
        }
    }
}