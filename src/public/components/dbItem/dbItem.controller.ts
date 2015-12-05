///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class DbItemController {
        private item:any;
        private image:string;
        private isFlipped:boolean = false;
        private number:number = 1;
        private canAddToBasket:boolean = false;

        static $inject = [
            injections.angular.$element,
            injections.services.loggerService,
            injections.services.menuService,
            injections.services.focusService
        ];

        constructor(private $element:ng.IAugmentedJQuery, private logger:services.LoggerService, private menuService:services.MenuService, private focusService:services.FocusService) {
            this.logger.info("DbItemController created");
            this.image = constants.CATEGORY_IMAGE_MAP[this.item.category];
            this.canAddToBasket = this.item.$has("addToBasket");
        }

        public flip(event:any) {
            if (event) {
                if (event.type === "click" ||
                    (event.type === "keypress" && event.which === 13)) {
                    this.isFlipped = !this.isFlipped;
                }
            }
            else {
                this.isFlipped = !this.isFlipped;
            }

            // we have to make sure the focus stays on the root element...
            var rootElement = this.$element.children()[0];
            this.focusService.focusByElement(rootElement);
        }

        public addToBasket(event:any):void {
            this.flip(event);
            var basketEntry = new models.BasketEntry(this.item.id, this.number);
            this.item.$post("addToBasket", null, basketEntry)
                .then(res => {
                    this.logger.info(this.item.name, "added to basket, " + this.number, enums.LogOptions.toast_only);
                    this.number = 1;
                    this.menuService.setNumberOfBasketItems(this.menuService.getNumberOfBasketItems() + 1);
                })
                .catch(err => {
                    this.logger.error("Failed to add item to basket", err, enums.LogOptions.toast);
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