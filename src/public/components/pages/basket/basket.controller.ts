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
            injections.services.localStorageService,
            injections.services.footerService,
        ];

        constructor(private basketResource:any, private basketResourceItems:any, private logger:services.LoggerService, private dashboardService:services.DashboardService,
                    private $state:ng.ui.IStateService, private scope:ng.IScope, private storage:services.LocalStorageService, private footer:services.FooterService) {

            this.currentFilter = this.storage.get(constants.LOCAL_STORAGE.basketFilter) || this.FILTER_TILE;

            this.Links = [
                {
                    id: this.FILTER_TILE,
                    aSpanClass: "glyphicon glyphicon-th-large",
                    aSpanTxt: "Tile"
                },
                {
                    id: this.FILTER_LIST,
                    aSpanClass: "glyphicon glyphicon-th-list",
                    aSpanTxt: "List"
                },
                {
                    id: this.STATE_ORDER,
                    aSpanClass: "glyphicon glyphicon-shopping-cart",
                    aSpanTxt: "Order"
                },
                {
                    id: this.STATE_CLEAR,
                    aSpanClass: "glyphicon glyphicon-trash",
                    aSpanTxt: "Clear"
                }
            ];

            footer.setFooterItems(this.Links);
            footer.setCallbackFooterItem((key) => this.callbackFooter(key));
            footer.setCurrentFilter(this.currentFilter);

            this.dashboard = dashboardService.dashboard;

            scope.$watchCollection(() => this.dashboard, (newValue, oldValue) => this.updateItems(newValue, oldValue));

            var total = 0;
            for (var y = 0; y < this.basketResourceItems.length; y++) {
                var dashItem = this.getItemFromDashboard(this.basketResourceItems[y].item.id);
                var priceItem = this.pricePerItem(dashItem.tick.price, this.basketResourceItems[y].number);
                this.basketItems.push({
                    basket: this.basketResourceItems[y],
                    tickprice: dashItem.tick.price,
                    dashItemId: dashItem.id,
                    dashItem: dashItem,
                    img: this.getImageForItem(dashItem.category),
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
            for (var z = 0; z < this.dashboard.length; z++) {
                if (idBasket == this.dashboard[z].id) {
                    return this.dashboard[z];
                }
            }
        }

        private getBasketItemById(id:string) {
            for (var i = 0; i < this.basketItems.length; i++) {
                if (this.basketItems[i].id == id) {
                    return this.basketItems[i];
                }
            }
        }

        public pricePerItem(price:number, piece:number) {
            return price * piece;
        }

        public deleteItem(id:string) {
            var item = this.getBasketItemById(id);
            if (item) {
                item.basket.$del("delete")
                    .then(res => {
                        this.logger.info("", "item removed", enums.LogOptions.toast);
                        this.$state.reload();
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
                    this.$state.reload();
                    this.logger.info("Order send", "", enums.LogOptions.toast);
                })
                .catch(err => {
                    this.logger.error("Failed to Create Order", err, enums.LogOptions.toast);
                });
        }

        public clearWholeBasket() {
            for (var i = 0; i < this.basketItems.length; i++) {
                this.basketItems[i].basket.$del("delete")
                    .then(res => {

                    })
                    .catch(err => {
                        this.logger.error("Failed to Remove Item", err, enums.LogOptions.toast);
                    });
            }

            this.logger.info("", "whole items removed", enums.LogOptions.toast);
            this.$state.reload();
        }

        public callbackFooter(filter:string) {
            if (filter == this.FILTER_LIST || filter == this.FILTER_TILE) {
                this.currentFilter = filter;
                this.storage.set(constants.LOCAL_STORAGE.basketFilter, filter);
                this.footer.setCurrentFilter(filter);
            } else if (filter == this.STATE_ORDER) {
                this.createOrder();
            } else if (filter == this.STATE_CLEAR) {
                this.clearWholeBasket();
            }

        }

        public basketItemAdd(id:string) {
            var item = this.getBasketItemById(id);
            if (item) {
                this.deleteItem(id);
                var number = Number(item.basket.number) + 1;
                var data = {
                    "drinkId" : item.basket.item.id,
                    "number" : number
                };
                this.basketResource.$post("create", null, data )
                    .then(res => {
                        this.$state.reload();
                    })
                    .catch(err => {
                        this.logger.error("Failed to update Item", err, enums.LogOptions.toast);
                    });
            }
        }

        public basketItemMinus(id:string) {
            var item = this.getBasketItemById(id);
            if (item) {
                this.deleteItem(id);
                var number = Number(item.basket.number);
                if (number > 2) {
                    number = number - 1.
                    var data = {
                        "drinkId" : item.basket.item.id,
                        "number" : number
                    };
                    this.basketResource.$post("create", null, data )
                        .then(res => {
                            this.$state.reload();
                        })
                        .catch(err => {
                            this.logger.error("Failed to update Item", err, enums.LogOptions.toast);
                        });
                }
            }
        }
    }
}