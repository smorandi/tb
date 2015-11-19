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
            this.logger.info("DbItemController called");
            this.image = constants.CATEGORY_IMAGE_MAP[this.item.category];
        }

        public flip() {
            this.isFlipped = !this.isFlipped;
        }

        public addToBasket($event:ng.IAngularEvent):void {
            $event.stopPropagation();
            this.logger.info(this.item.name, "added to basket, " + this.number, enums.LogOptions.toast_only);
        }

        public increment($event:ng.IAngularEvent):void {
            $event.stopPropagation();
            this.number++;
            console.log("clicked");
        }

        public decrement($event:ng.IAngularEvent):void {
            $event.stopPropagation();
            this.number = Math.max(0, this.number - 1);
        }
    }
}