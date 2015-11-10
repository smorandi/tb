///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class BasketController {
        public basketItems = [];
        private basketTotalPrice = { price: 0};
        public dashboard = [];
        public currentFilter:string = "all";

        static $inject = [
            "basketResource",
            injections.services.loggerService,
            injections.services.dashboardService,
            injections.uiRouter.$stateService,
            injections.angular.$scope,
            "filter"
        ];

        constructor(private basketResource:any, private logger:services.LoggerService, private dashboardService:services.DashboardService, private $state:ng.ui.IStateService,
                    private scope:ng.IScope, private filter:string) {

            this.currentFilter = filter;
            this.dashboard = dashboardService.dashboard;
            scope.$watch( "vm.dashboard", function(newValue, oldValue){
                for(var a = 0; a < newValue.length; a++) {
                    var line = scope.vm.getBasketItemById(scope.vm.basketItems, newValue[a].id);
                    line.tickprice = newValue[a].tick.price;
                    line.priceItem = scope.vm.pricePerItem(line.tickprice, line.basket.number);
                    line.dashItem = newValue[a];
                }
            }, true );

            this.basketResource.$get("items")
                .then(res => {
                    var total = 0;
                    for(var y = 0; y < res.length; y++){
                        var dashItem = this.getItemFromDashboard(res[y].item.id);
                        var priceItem = this.pricePerItem(dashItem.tick.price, res[y].number);
                        this.basketItems.push({
                            basket: res[y],
                            tickprice: dashItem.tick.price,
                            dashItemId: dashItem.id,
                            dashItem: dashItem,
                            img: this.getImageForItem(dashItem.category),
                            priceItem: priceItem,
                        });

                       total = Number(total) + Number(priceItem);
                    }

                    this.basketTotalPrice.price = total;
                })
                .catch(err => {
                    this.logger.error("Failed to Remove Item", err, enums.LogOptions.toast);
                });


        }

        public getBasketItemById(basketItem, id) {
            for(var x = 0; x < basketItem.length; x++) {
                if(id == basketItem[x].dashItemId){
                    return basketItem[x];
                }
            }
        }

        public getImageForItem(cat:any) {
            switch (cat) {
                case "beer":
                    return "assets/images/drinks/beer.jpg";
                case "cocktail":
                    return "assets/images/drinks/cocktail.jpg";
                case "wine":
                    return "assets/images/drinks/wine.jpg";
                case "coffee":
                    return "assets/images/drinks/coffee.jpg";
                case "tea":
                    return "assets/images/drinks/tea.jpg";
                case "shot":
                    return "assets/images/drinks/shot.jpg";
                case "soft":
                    return "assets/images/drinks/soft.jpg";
            }
        }

        private getItemFromDashboard(idBasket:string) {
            for(var z = 0; z < this.dashboard.length; z++){
                if(idBasket == this.dashboard[z].id){
                    return this.dashboard[z];
                }
            }
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
                            this.$state.reload();
                        })
                        .catch(err => {
                            this.logger.error("Failed to Remove Item", err, enums.LogOptions.toast);
                        });
                }
            }
        }

        public createOrder() {
            this.basketResource.$post("createOrder")
                .then(res => {
                    this.logger.info("", "order send", enums.LogOptions.toast);
                    this.$state.reload();
                })
                .catch(err => {
                    this.logger.error("Failed to Create Order", err, enums.LogOptions.toast);
                });
        }
    }
}