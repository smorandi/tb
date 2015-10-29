///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class MenuService {
        public menu:any;

        static $inject = [
            injections.angular.$log,
            injections.uiRouter.$stateService,
            injections.services.authService,
            injections.services.navigationService,
        ];
        constructor(private $log:ng.ILogService, private $state:ng.ui.IStateService, private authService:services.AuthService, private navigationService:services.NavigationService) {
            this.menu = {
                resource: null,
                isLoggedIn: false,
                loginname: null,
                numberOfBasketItems: 0,
                userType: null,
                registerLink: constants.LINKS.register,
                profileLink: constants.LINKS.profile,
                basketLink: constants.LINKS.basket,
                navigationLinks: {},
            };
        }

        public getMenu():Object {
            return this.menu;
        }

        public login():void {
            this.$state.go(constants.STATES.home);
        }

        public logout():void {
            this.authService.clearToken();
            this.$state.go(constants.STATES.dashboard, {}, {reload: true});
        }

        public getLink(rel:string):interfaces.ILink {
            return constants.REL_TO_LINK_MAP[rel];
        }

        public setResource(resource:any) {
            this.menu.resource = resource;
            this.menu.navigationLinks = {};

            //if (resource.$has("home")) {
            //    this.pages.push(new models.Page("Login", "root.home"));
            //}

            this.menu.userType = resource.userType;
            this.menu.isLoggedIn = resource.loginname ? true : false;
            this.menu.loginname = resource.loginname;
            this.menu.numberOfBasketItems = resource.numberOfBasketItems;


            this.menu.registerLink = resource.$has(constants.RELS.register) ? constants.LINKS.register : null;
            this.menu.profileLink = resource.$has(constants.RELS.profile) ? constants.LINKS.profile : null;
            this.menu.basketLink = resource.$has(constants.RELS.basket) ? constants.LINKS.basket : null;

            if (resource.$has(constants.RELS.dashboard)) {
                this.menu.navigationLinks[constants.RELS.dashboard] = constants.LINKS.dashboard;
            }
            if (resource.$has(constants.RELS.drinks)) {
                this.menu.navigationLinks[constants.RELS.drinks] = constants.LINKS.drinks;
            }
            if (resource.$has(constants.RELS.system)) {
                this.menu.navigationLinks[constants.RELS.system] = constants.LINKS.system;
            }
        }
    }
}
