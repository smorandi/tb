///<reference path="../../all.references.ts" />

"use strict";

module directives {
    export function SubHeader(subHeaderService:services.SubHeaderService):ng.IDirective {
        return {
            templateUrl: "components/header/subHeader.html",
            link: (scope:any) => {
                scope.subTitle = subHeaderService.getSubTitle();
                scope.subTitleTxt = subHeaderService.getSubTitleTxt();
            }
        };
    }
}