///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class SubHeaderService {
        public subTitle:string;
        public subTitleTxt:string;

        static $inject = [
            injections.services.loggerService,
        ];

        constructor(private logger:services.LoggerService) {

        }

        public setSubTitle(title:string) {
            this.subTitle = title;
        }

        public setSubTitleTxt(txt:string) {
            this.subTitleTxt = txt;
        }

        public getSubTitle():string {
            return this.subTitle;
        }

        public getSubTitleTxt():string {
            return this.subTitleTxt;
        }

    }
}
