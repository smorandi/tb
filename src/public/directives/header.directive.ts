///<reference path="../all.references.ts" />

module directives {

    export function HeaderDirective(menuService:services.MenuService):ng.IDirective {

        return {
            templateUrl: "directives/header.html",
            link: (scope:any) => {
                scope.vm = {
                    menu: menuService.getMenu(),
                    login: () => menuService.login(),
                    logout: () => menuService.logout(),
                };
            }
        };
    }
}