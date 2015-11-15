///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class FooterService {
        public footerItems:any;
        public showSearch:boolean = false;
        public currentFooterItem:string;
        public callbackFooterItem:any;

        static $inject = [
            injections.services.loggerService,
        ];

        constructor(private logger:services.LoggerService) {

        }

        public setFooterItems(itemObject:any){
            this.footerItems = itemObject;
        }

        public getFooterItems():any{
            return this.footerItems;
        }

        public setCurrentFilter(id:string):void{
            this.currentFooterItem = id;
        }

        public getClassActiveFilter(key):string {
            if(key == this.currentFooterItem){
                return 'active';
            } else {
                return '';
            }
        }

        public callbackFooter(key:string){
            if (this.callbackFooterItem) {
                this.callbackFooterItem(key);
            }
        }

        public setCallbackFooterItem(callback){
            this.callbackFooterItem = callback;
        }

        public setShowFooter(show:boolean) {
            this.showSearch = show;
        }

        public getShowFooter():boolean {
            return this.showSearch;
        }

    }
}
