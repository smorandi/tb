///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function Footer(footerService:services.FooterService):ng.IDirective {
        return {
            templateUrl: "components/footer/footer.html",
            link: (scope:any) => {
                scope.footerLinks = footerService.getFooterItems();
                scope.go= (id:string) => footerService.setCurrentFilter(id);
                scope.getActiveClass = (key) => footerService.getClassActiveFilter(key);
                scope.callback = (id) => footerService.callbackFooter(id);
                scope.showFooter = footerService.getShowFooter();
            }


        };
    }
}