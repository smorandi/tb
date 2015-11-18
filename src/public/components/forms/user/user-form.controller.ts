///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class UserForm {
        static $inject = [
            injections.services.loggerService
        ];

        constructor(private logger:services.LoggerService) {
        }
    }
}