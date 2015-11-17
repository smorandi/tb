///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class DbItemController {
        private item:any;
        private image:string;

        static $inject = [
            injections.services.loggerService
        ];

        constructor(private logger:services.LoggerService) {
            this.logger.info("DbItemController called");
            this.image = constants.CATEGORY_IMAGE_MAP[this.item.category];
        }

        public showDetails() {
            this.logger.info(this.item.id, this.item.name, enums.LogOptions.toast_only);
        }
    }
}