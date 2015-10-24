///<reference path="../all.references.ts" />

module services {
    export class MenuService {
        private menu:any;
        private resource:any;

        constructor(private $log:ng.ILogService, private $state:ng.ui.IStateService, private authService:services.AuthService) {
            this.menu = {
                isLoggedIn: false,
                loginname: null,
                numberOfBasketItems: 0,
                canRegister: false,
                registrationPage: constants.pages.register,
                canEditProfile: false,
                profilePage: constants.pages.profile,
                pages: [],
            };
        }

        public getMenu() {
            return this.menu;
        }

        public login() {
            this.$state.go(constants.pages.home.state);
        }

        public logout() {
            this.authService.clearToken();
            this.$state.go(constants.pages.dashboard.state, {}, {reload: true});
        }

        public setResource(resource:any) {
            this.resource = resource;
            this.menu.pages.length = 0;

            //if (resource.$has("home")) {
            //    this.pages.push(new models.Page("Login", "root.home"));
            //}

            this.menu.canRegister = resource.$has("registerCustomer") ? true : false;
            this.menu.canEditProfile = resource.$has("profile") ? true : false;
            this.menu.isLoggedIn = resource.loginname ? true : false;
            this.menu.loginname = resource.loginname ? resource.loginname : null;
            this.menu.numberOfBasketItems = resource.numberOfBasketItems ? resource.numberOfBasketItems : 0;

            if (resource.$has("drinks")) {
                this.menu.pages.push(constants.pages.drinks);
            }
            if (resource.$has("system")) {
                this.menu.pages.push(constants.pages.system);
            }
            if (resource.$has("dashboard")) {
                this.menu.pages.push(constants.pages.dashboard);
            }
        }
    }
}
