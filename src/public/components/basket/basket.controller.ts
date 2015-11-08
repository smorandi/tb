///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class BasketController {
        static $inject = [
            "basketResource",
            injections.services.loggerService,
            injections.angular.$httpService,
        ];

        private basketItems;
        private basketTotalPrice;
        private basket;
        private log:services.LoggerService;
        private http:ng.IHttpService;

        constructor(private basketResource:any, private Logger:services.LoggerService, private $http:ng.IHttpService) {
            this.log = Logger;
            this.http = $http;
            this.basket = basketResource;
            basketResource.$get("items").then(res =>{
                    this.basketItems = res;
                    this.computeTotal();
                }
            )
        }

        public pricePerItem(price:number, piece:number) {
            return price * piece;
        }

        public deleteItem(id:string) {
            for(var i = 0; i < this.basketItems.length; i++){
                if(this.basketItems[i].id == id){
                    var intern = this;
                    var del = i;
                    this.basketItems[i].$del("delete").then(function(){
                        intern.log.info("","item removed", enums.LogOptions.toast);
                        intern.basketItems.splice(del,1);
                        intern.computeTotal();
                    }, function(){
                        this.log.error("error", "error while remove item", enums.LogOptions.toast);
                    });
                }
            }
        }

        public computeTotal(){
            var price = 0;
            for(var i = 0; i < this.basketItems.length; i++){
                price =  Number(price) + Number(this.pricePerItem(this.basketItems[i].number, this.basketItems[i].item.tick.price));
            }
            this.basketTotalPrice = price;
        }

        public createOrder(){
            var intern = this;
            this.basket.$post("createOrder").then(function(){
                intern.log.info("","order send", enums.LogOptions.toast);
                intern.basketItems.splice(0, intern.basketItems.length)
                intern.basketTotalPrice = 0;
            }, function(){
                intern.log.error("error","can't create order", enums.LogOptions.toast);
            });
        }
    }
}