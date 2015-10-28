///<reference path="../all.references.ts" />

module directives {

    export function HeaderDirective(menuService:services.MenuService):ng.IDirective {
        return {
            templateUrl: "directives/header.html",
            link: (scope:any) => {
                scope.menu = menuService.getMenu();
                scope.login= () => menuService.login();
                scope.logout= () => menuService.logout();
            }
        };
    }
}