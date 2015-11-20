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
            var basket = {
                drinkId: this.item.id,
                number: this.number
            };
            this.item.$post("addBasket", null, basket)
                .then(res => {
                    this.logger.info(this.item.name, "added to basket, " + this.number, enums.LogOptions.toast_only);
                    this.number = 1;
                })
                .catch(err => {
                    this.logger.error("Failed to added to basket", err, enums.LogOptions.toast);
                });
        }

        public increment():void {
            this.number++;
        }

        public decrement():void {
            this.number = Math.max(1, this.number - 1);
        }
    }
}