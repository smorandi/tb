///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class DbItemController {
        private item:any;
        private image:string;
        private isFlipped:boolean = false;
        private number:number = 1;

        static $inject = [
            injections.services.loggerService
        ];

        constructor(private logger:services.LoggerService) {
            this.logger.info("DbItemController created");
            this.image = constants.CATEGORY_IMAGE_MAP[this.item.category];
        }

        public flip() {
            this.isFlipped = !this.isFlipped;
        }

        public addToBasket():void {
            this.flip();
            this.number = 1;
            this.logger.info(this.item.name, "added to basket, " + this.number, enums.LogOptions.toast_only);
        }

        public increment():void {
            this.number++;
        }

        public decrement():void {
            this.number = Math.max(1, this.number - 1);
        }
    }
}