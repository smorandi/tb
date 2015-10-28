///<reference path="../all.references.ts" />

module services {
    export class MenuService {
        private menu:any;

        constructor(private $log:ng.ILogService, private $state:ng.ui.IStateService, private authService:services.AuthService, private linkService:services.LinkService) {
            this.menu = {
                resource: null,
                isLoggedIn: false,
                loginname: null,
                numberOfBasketItems: 0,
                userType: null,
                registerLink: constants.LINKZ.register,
                profileLink: constants.LINKZ.profile,
                basketLink: constants.LINKZ.basket,
                navigationLinks: {},
            };
        }

        public getMenu() {
            return this.menu;
        }

        public login() {
            this.$state.go(constants.STATES.home);
        }

        public logout() {
            this.authService.clearToken();
            this.$state.go(constants.STATES.dashboard, {}, {reload: true});
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


            this.menu.registerLink = resource.$has(constants.RELS.register) ? constants.LINKZ.register : null;
            this.menu.profileLink = resource.$has(constants.RELS.profile) ? constants.LINKZ.profile : null;
            this.menu.basketLink = resource.$has(constants.RELS.basket) ? constants.LINKZ.basket : null;

            if (resource.$has(constants.RELS.dashboard)) {
                this.menu.navigationLinks[constants.RELS.dashboard] = constants.LINKZ.dashboard;
            }
            if (resource.$has(constants.RELS.drinks)) {
                this.menu.navigationLinks[constants.RELS.drinks] = constants.LINKZ.drinks;
            }
            if (resource.$has(constants.RELS.system)) {
                this.menu.navigationLinks[constants.RELS.system] = constants.LINKZ.system;
            }
        }
    }
}
