///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class SubHeaderService {
        public subTitle:string;
        public subTitleTxt:string;
        public viewId:string;
        private textIdTranslate:any;

        static $inject = [
            injections.services.loggerService,
        ];

        constructor(private logger:services.LoggerService) {
            this.textIdTranslate = {
                basket : {
                    subTitle : "SUBHEAD_BASKET",
                    subTitleTxt : "SUBHEAD_TXT_BASKET"
                },
                orders: {
                    subTitle : "SUBHEAD_ORDERS",
                    subTitleTxt : "SUBHEAD_TXT_ORDERS"
                },
                drinks: {
                    subTitle : "SUBHEAD_DRINKS",
                    subTitleTxt : "SUBHEAD_TXT_DRINKS"
                },
                profile: {
                    subTitle : "SUBHEAD_PROFILE",
                    subTitleTxt : "SUBHEAD_TXT_PROFILE"
                },
                system: {
                    subTitle : "SUBHEAD_SYSTEM",
                    subTitleTxt : "SUBHEAD_TXT_SYSTEM"
                },
                dashboard: {
                    subTitle : "SUBHEAD_DASHBOARD",
                    subTitleTxt : "SUBHEAD_TXT_DASHBOARD"
                },
                register: {
                    subTitle : "SUBHEAD_REGISTER",
                    subTitleTxt : "SUBHEAD_TXT_REGISTER"
                }
            }
        }

        public setView(id:string){
            this.viewId = id;
        }

        public getSubTitle():string {
            return this.textIdTranslate[this.viewId].subTitle;
        }

        public getSubTitleTxt():string {
            return this.textIdTranslate[this.viewId].subTitleTxt;
        }

    }
}
