///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class BasketController {
        static $inject = [
            "basketResource",
            injections.services.loggerService
        ];

        private basketItems;
        private basketTotalPrice;
        private basket;

        constructor(private basketResource:any, private logger:services.LoggerService) {
            this.basket = basketResource;
            this.basketResource.$get("items")
                .then(res => {
                    this.basketItems = res;
                    this.computeTotal();
                })
                .catch(err => {
                    this.logger.error("Failed to Remove Item", err, enums.LogOptions.toast);
                });
        }

        public pricePerItem(price:number, piece:number) {
            return price * piece;
        }

        public deleteItem(id:string) {
            for (var i = 0; i < this.basketItems.length; i++) {
                if (this.basketItems[i].id == id) {
                    var del = i;
                    this.basketItems[i].$del("delete")
                        .then(res => {
                            this.logger.info("", "item removed", enums.LogOptions.toast);
                            // better would be to do this --> this.$state.reload();
                            this.basketItems.splice(del, 1);
                            this.computeTotal();
                        })
                        .catch(err => {
                            this.logger.error("Failed to Remove Item", err, enums.LogOptions.toast);
                        });
                }
            }
        }

        public computeTotal() {
            var price = 0;
            for (var i = 0; i < this.basketItems.length; i++) {
                price = Number(price) + Number(this.pricePerItem(this.basketItems[i].number, this.basketItems[i].item.tick.price));
            }
            this.basketTotalPrice = price;
        }

        public createOrder() {
            this.basket.$post("createOrder")
                .then(res => {
                    this.logger.info("", "order send", enums.LogOptions.toast);
                    this.basketItems.splice(0, this.basketItems.length)
                    this.basketTotalPrice = 0;
                })
                .catch(err => {
                    this.logger.error("Failed to Create Order", err, enums.LogOptions.toast);
                });
        }
    }
}