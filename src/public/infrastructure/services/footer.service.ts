///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class FooterService {
        public links:any;
        public showSearch:boolean;
        public currentFilter:string;
        public callbackFilter:any;

        static $inject = [
            injections.services.loggerService,
        ];

        constructor(private logger:services.LoggerService) {

        }

        public setLinks(pLinks:any){
            this.links = pLinks;
        }

        public getLinks():any{
            return this.links;
        }

        public setCurrentFilter(id:string):void{
            this.currentFilter = id;
        }

        public getClassActiveFilter(key):string {
            if(key == this.currentFilter){
                return 'active';
            } else {
                return '';
            }
        }

        public setFilter(key:string){
            if (this.callbackFilter) {
                this.callbackFilter(key);
            }
        }

    }
}
