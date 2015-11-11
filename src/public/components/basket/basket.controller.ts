///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class BasketController {
        public basketItems = [];
        private basketTotalPrice = {price: 0};
        public dashboard = [];
        public currentFilter:string;
        public FILTER_TILE:string = constants.FILTER.basketTile;
        public FILTER_LIST:string = constants.FILTER.basketList;
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

            this.Links = [ {
                    id : this.FILTER_TILE,
                    aSpanClass : "glyphicon glyphicon-th-large",
                    aSpanTxt : "Tile"
                },
                {
                    id : this.FILTER_LIST,
                    aSpanClass : "glyphicon glyphicon-th-list",
                    aSpanTxt : "List"
                }
            ];

            footer.setLinks(this.Links);
            footer.setCurrentFilter(this.currentFilter);

            this.dashboard = dashboardService.dashboard;

            scope.$watch("vm.dashboard", function (newValue, oldValue) {
                var price = 0;
                for (var a = 0; a < scope.vm.basketItems.length; a++) {
                    var line = scope.vm.getDashboardItemById(newValue, scope.vm.basketItems[a].dashItemId );
                    if (line) {
                        scope.vm.basketItems[a].tickprice = line.tick.price;
                        scope.vm.basketItems[a].priceItem = scope.vm.pricePerItem(scope.vm.basketItems[a].tickprice, scope.vm.basketItems[a].basket.number);
                        scope.vm.basketItems[a].dashItem = line;
                        price = Number(price) + Number(scope.vm.basketItems[a].priceItem);
                    }
                }
                scope.vm.basketTotalPrice.price = price;
            }, true);

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

        public setFilter(filter:string) {
            this.currentFilter = filter;
            this.storage.set(constants.LOCAL_STORAGE.basketFilter, filter);
            this.footer.setCurrentFilter(filter);
        }
    }
}