///<reference path="../../all.references.ts" />

"use strict";

module controllers {
    export class Header {
        private menu;

        static $inject = [
            injections.services.loggerService,
            injections.services.menuService
        ];

        constructor(private logger:services.LoggerService, private menuService:services.MenuService) {
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