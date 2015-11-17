///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function Header(menuService:services.MenuService, navigationService:services.NavigationService):ng.IDirective {
        return {
            restrict: "E",
            templateUrl: injections.components.header.template,
            link: (scope:any) => {
                scope.menu = menuService.getMenu();
                scope.getLink = (rel:string) => menuService.getLink(rel);
                scope.login= () => menuService.login();
                scope.logout= () => menuService.logout();
                scope.go= (link:interfaces.ILink) => navigationService.go(link);
            }
        };
    }
}