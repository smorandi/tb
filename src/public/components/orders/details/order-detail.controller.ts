///<reference path="../../../all.references.ts" />

"use strict";

module controllers {
    export class OrderDetailsController {
        public order:any;
        public currentFilter:string;
        public VIEW_TILE:string = constants.FOOTER_STATE.orderTile;
        public VIEW_LIST:string = constants.FOOTER_STATE.orderList;
        public STATE_BACK:string = "back";
        public Links:any;

        static $inject = [
            injections.angular.$log,
            injections.angular.$location,
            injections.uiRouter.$stateService,
            injections.services.utilsService,
            "orderResource",
            injections.services.localStorageService,
            injections.services.footerService,
        ];

        constructor(private $log:ng.ILogService, private $location:ng.ILocationService, private $state:ng.ui.IStateService, private utilsService:services.UtilsService, private orderResource,
                    private storage:services.LocalStorageService, private footer:services.FooterService) {

            $log.info("OrderDetailsController called with client-url: " + $location.path());
            this.order = orderResource;

            this.currentFilter = this.storage.get(constants.LOCAL_STORAGE.orderView) || this.VIEW_TILE;

            this.Links = [
                {
                    id: this.STATE_BACK,
                    aSpanClass: "glyphicon glyphicon-arrow-left",
                    aSpanTxt: ""
                },
                {
                    id: this.VIEW_TILE,
                    aSpanClass: "glyphicon glyphicon-th-large",
                    aSpanTxt: "Tile"
                },
                {
                    id: this.VIEW_LIST,
                    aSpanClass: "glyphicon glyphicon-th-list",
                    aSpanTxt: "List"
                },
            ];

            footer.setFooterItems(this.Links);
            footer.setCallbackFooterItem((key) => this.callbackFooter(key));
            footer.setCurrentFilter(this.currentFilter);

        }


        public callbackFooter(filter:string) {
            if (filter == this.VIEW_LIST || filter == this.VIEW_TILE) {
                this.currentFilter = filter;
                this.storage.set(constants.LOCAL_STORAGE.orderView, filter);
                this.footer.setCurrentFilter(filter);
            } else if (filter == this.STATE_BACK) {
                this.$state.go(constants.STATES.orders);
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

    }
}
