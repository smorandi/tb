///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class Header {
        private menu;

        static $inject = [
            injections.services.loggerService,
            injections.services.menuService,
            injections.services.navigationService,
        ];

        constructor(private logger:services.LoggerService, private menuService:services.MenuService, private navigationService:services.NavigationService) {
            this.menu = menuService.getMenu();
        }

        public login() {
            this.menuService.login();
        }

        public logout() {
            this.menuService.logout();
        }
    }
}