///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class BasketController {
        public basketItems = [];
        private basketTotalPrice = {price: 0};
        public dashboard = [];
        public currentFilter:string;
        public FILTER_TILE:string = constants.FILTER.basketTile;
        public FILTER_LIST:string = constants.FILTER.basketList;
        public STATE_ORDER:string = "order";
        public STATE_CLEAR:string = "clear";
        public Links:any;
        public showFooter:boolean = false;

        static $inject = [
            "basketResource",
            "basketResourceItems",
            injections.services.loggerService,
            injections.services.dashboardService,
            injections.uiRouter.$stateService,
            injections.angular.$scope,
            injections.services.footerService,
        ];

        constructor(private basketResource:any, private basketResourceItems:any, private logger:services.LoggerService, private dashboardService:services.DashboardService,
                    private $state:ng.ui.IStateService, private scope:ng.IScope, private footer:services.FooterService) {


            this.dashboard = dashboardService.dashboard;

            scope.$watchCollection(() => this.dashboard, (newValue, oldValue) => this.updateItems(newValue, oldValue));

            var total = 0;
            for (var y = 0; y < this.basketResourceItems.length; y++) {
                var dashItem;
                var priceItem;
                var tickprice;
                var dashItemId;
                var image;
                dashItem = this.getItemFromDashboard(this.basketResourceItems[y].item.id);
                if (dashItem) {
                    priceItem = this.pricePerItem(dashItem.tick.price, this.basketResourceItems[y].number);
                    tickprice = dashItem.tick.price;
                    dashItemId = dashItem.id;
                    image = this.getImageForItem(dashItem.category);
                }

                this.basketItems.push({
                    basket: this.basketResourceItems[y],
                    tickprice: tickprice,
                    dashItemId: dashItemId,
                    dashItem: dashItem,
                    img: image,
                    priceItem: priceItem,
                });

                total = Number(total) + Number(priceItem);
            }

            this.basketTotalPrice.price = total;


        }

        public updateItems(newValue, oldValue) {
            var price = 0;
            for (var a = 0; a < this.basketItems.length; a++) {
                var line = this.getDashboardItemById(newValue, this.basketItems[a].dashItemId);
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

        public getImageForItem(cat:any) {
            return constants.CATEGORY_IMAGE_MAP[cat];
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

        public clearWholeBasket() {
            for (var i = 0; i < this.basketItems.length; i++) {
                this.basketItems[i].basket.$del("delete")
                    .then(res => {
                        this.$state.reload().then(res=> {
                            this.logger.info("Whole items removed", "", enums.LogOptions.toast);
                        });
                    })
                    .catch(err => {
                        this.logger.error("Failed to Remove Item", err, enums.LogOptions.toast);
                    });
            }
        }

        public basketItemChange(item:any, sign:string) {
            if (item) {
                if (sign == "+") {
                    item.basket.number = Number(item.basket.number) + 1;
                } else if (sign == "-" && item.basket.number >= 2){
                        item.basket.number = Number(item.basket.number - 1);
                }
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
        }
    }
}