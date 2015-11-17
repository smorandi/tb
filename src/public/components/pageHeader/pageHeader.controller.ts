///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class PageHeader {
        private title;
        private subtitle;

        static $inject = [
            injections.services.loggerService,
        ];

        constructor(private logger:services.LoggerService) {
        }
    }
}