///<reference path="../all.references.ts" />

module directives {

    export function HeaderDirective(pageService:services.PageService):ng.IDirective {
        return {
            templateUrl: "directives/header.html",
            link: (scope:ng.IScope) => {
                scope["pages"] = pageService.getPages();
            }
        };
    }
}