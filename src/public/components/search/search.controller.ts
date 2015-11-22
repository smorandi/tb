///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class SearchController {
        private search:any;

        static $inject = [
            injections.services.loggerService
        ];

        constructor(private logger:services.LoggerService) {
            this.logger.info("SearchController created");
        }
    }
}