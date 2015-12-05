///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class BasketController {
        private basketItems = [];
        private basketTotalPrice = {price: 0};
        private dashboard = [];

        static $inject = [
            "basketResource",
            "basketResourceItems",
            injections.services.loggerService,
            injections.services.dashboardService,
            injections.uiRouter.$stateService,
            injections.angular.$scope,
        ];

        constructor(private basketResource:any,
                    private basketResourceItems:any,
                    private logger:services.LoggerService,
                    private dashboardService:services.DashboardService,
                    private $state:ng.ui.IStateService,
                    private $scope:ng.IScope) {


            this.dashboard = dashboardService.dashboard;

            var total = 0;
            for (var y = 0; y < this.basketResourceItems.length; y++) {
                var dashItem;
                var priceItem;
                var tickprice;
                var dashItemId;
                dashItem = this.getItemFromDashboard(this.basketResourceItems[y].item.id);
                if (dashItem) {
                    priceItem = this.pricePerItem(dashItem.tick.price, this.basketResourceItems[y].number);
                    tickprice = dashItem.tick.price;
                    dashItemId = dashItem.id;
                }

                this.basketItems.push({
                    basket: this.basketResourceItems[y],
                    tickprice: tickprice,
                    dashItemId: dashItemId,
                    dashItem: dashItem,
                    priceItem: priceItem,
                });

                total = Number(total) + Number(priceItem);
            }

            this.basketTotalPrice.price = total;

            this.$scope.$watch(() => dashboardService.dashboard, items => this.update(items), true);
        }

        public update(items) {
            var price = 0;
            for (var a = 0; a < this.basketItems.length; a++) {
                var line = this.getDashboardItemById(items, this.basketItems[a].dashItemId);
                if (line) {
                    this.basketItems[a].tickprice = line.tick.price;
                    this.basketItems[a].priceItem = this.pricePerItem(this.basketItems[a].tickprice, this.basketItems[a].basket.number);
                    this.basketItems[a].dashItem = line;
                    price = Number(price) + Number(this.basketItems[a].priceItem);
                }
            }
            this.basketTotalPrice.price = price;
        }

        public getDashboardItemById(dashboard, id) {
            for (var x = 0; x < dashboard.length; x++) {
                if (id == dashboard[x].id) {
                    return dashboard[x];
                }
            }
        }

        private getItemFromDashboard(idBasket:string) {
            for (var z = 0; z < this.dashboard.length; z++) {
                if (idBasket == this.dashboard[z].id) {
                    return this.dashboard[z];
                }
            }
        }

        public pricePerItem(price:number, piece:number) {
            return price * piece;
        }

        public deleteItem(item:any) {
            if (item) {
                item.basket.$del("delete")
                    .then(res => {
                        this.$state.reload()
                            .then(res=> {
                                this.logger.info("Item removed", "", enums.LogOptions.toast);
                            });
                    })
                    .catch(err => {
                        this.logger.error("Failed to Remove Item", err, enums.LogOptions.toast);
                    });
            } else {
                this.logger.error("Failed to Remove Item", "", enums.LogOptions.toast);
            }
        }

        public createOrder() {
            this.basketResource.$post("createOrder")
                .then(res => {
                    this.$state.reload()
                        .then(res=> {
                            this.logger.info("Order placed", "", enums.LogOptions.toast);
                        });

                })
                .catch(err => {
                    this.logger.error("Failed to Create Order", err, enums.LogOptions.toast);
                });
        }

        public clearBasket() {
            for (var i = 0; i < this.basketItems.length; i++) {
                this.basketItems[i].basket.$del("delete")
                    .then(res => {
                        this.$state.reload().then(res=> {
                            this.logger.info("Your basket has been cleared", "", enums.LogOptions.toast);
                        });
                    })
                    .catch(err => {
                        this.logger.error("Failed to remove items", err, enums.LogOptions.toast);
                    });
            }
        }

        private updateBasketItem(item:any) {
            item.basket.$put("update", null, item.basket)
                .then(res => {
                    this.$state.reload()
                        .then(res=> {
                            this.logger.info("Basket updated", "", enums.LogOptions.toast);
                        });
                })
                .catch(err => {
                    this.logger.error("Failed to update Item", err, enums.LogOptions.toast);
                });
        }

        public increment(item:any):void {
            item.basket.number++;
            this.updateBasketItem(item);
        }

        public decrement(item:any):void {
            item.basket.number = Math.max(1, item.basket.number - 1);
            this.updateBasketItem(item);
        }
    }
}