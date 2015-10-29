///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function Header(menuService:services.MenuService):ng.IDirective {
        return {
            templateUrl: "infrastructure/directives/header.html",
            link: (scope:any) => {
                scope.menu = menuService.getMenu();
                scope.getLink = (rel) => menuService.getLink(rel);
                scope.login= () => menuService.login();
                scope.logout= () => menuService.logout();
            }
        };
    }
}