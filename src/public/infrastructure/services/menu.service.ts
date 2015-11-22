///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class MenuService {
        private menu:any;

        static $inject = [
            injections.services.loggerService,
            injections.uiRouter.$stateService,
            injections.services.authService
        ];

        constructor(private logger:services.LoggerService,
                    private $state:ng.ui.IStateService,
                    private authService:services.AuthService) {
            this.menu = {
                resource: null,
                isLoggedIn: false,
                loginname: null,
                numberOfBasketItems: 0,
                userType: null,
                registerLink: constants.LINKS.register,
                profileLink: constants.LINKS.profile,
                basketLink: constants.LINKS.basket,
                ordersLink: constants.LINKS.orders,
                navigationLinks: {},
                controlLinks: {}
            };
        }

        public setNumberOfBasketItems(number:number):void {
            this.menu.numberOfBasketItems = number;
        }

        public getNumberOfBasketItems():number {
            return this.menu.numberOfBasketItems;
        }


        public getMenu():Object {
            return this.menu;
        }

        public login():void {
            this.$state.go(constants.STATES.home);
        }

        public logout():void {
            this.authService.clearCredentials();
            this.$state.go(constants.STATES.dashboard, {}, {reload: true}).then(() => {
                this.logger.info("Logged Out", "See you soon!", enums.LogOptions.toast);
            });
        }

        public getLink(rel:string):interfaces.ILink {
            return constants.REL_TO_LINK_MAP[rel];
        }

        public setResource(resource:any) {
            this.menu.resource = resource;

            this.menu.navigationLinks = {};
            this.menu.controlLinks = {};

            this.menu.userType = resource.userType;
            this.menu.isLoggedIn = resource.loginname ? true : false;
            this.menu.loginname = resource.loginname;
            this.menu.numberOfBasketItems = resource.numberOfBasketItems;

            this.menu.registerLink = resource.$has(constants.RELS.register) ? constants.LINKS.register : null;
            this.menu.profileLink = resource.$has(constants.RELS.profile) ? constants.LINKS.profile : null;
            this.menu.basketLink = resource.$has(constants.RELS.basket) ? constants.LINKS.basket : null;
            this.menu.ordersLink = resource.$has(constants.RELS.orders) ? constants.LINKS.orders : null;

            if (resource.$has(constants.RELS.dashboard)) {
                this.menu.navigationLinks[constants.RELS.dashboard] = constants.LINKS.dashboard;
            }
            if (resource.$has(constants.RELS.drinks)) {
                this.menu.navigationLinks[constants.RELS.drinks] = constants.LINKS.drinks;
            }
            if (resource.$has(constants.RELS.system)) {
                this.menu.navigationLinks[constants.RELS.system] = constants.LINKS.system;
            }
            if (resource.$has(constants.RELS.users)) {
                this.menu.navigationLinks[constants.RELS.users] = constants.LINKS.users;
            }
        }
    }
}
