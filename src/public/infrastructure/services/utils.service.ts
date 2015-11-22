///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class UtilsService {
        static $inject = [injections.angular.$window];

        constructor(private $window:ng.IWindowService) {
        }

        public removeHostFromUrl(url:string):string {
            return url.replace(/^[^#]*?:\/\/.*?(\/.*)$/, "$1");
        }

        public showPopup(message:string):boolean {
            return this.$window.confirm(message);
        }

        public alert(message:string):void {
            this.$window.alert(message);
        }

        public findInArray<T>(array:Array<T>, predicate:(element:T) => boolean):T {
            for (var i = 0; i < array.length; i++) {
                var testee = array[i];
                if (predicate(testee)) {
                    return testee;
                }
            }
            return null;
        }

        public replaceInArray<T>(array:Array<T>, property:string, value:any, replacement:T):void {
            for (var i = 0; i < array.length; i++) {
                var testee = array[i];
                if (angular.equals(testee[property], value)) {
                    array[i] = replacement;
                }
            }
        }

        public removeFromArray<T>(array:Array<T>, property:string, value:any):void {
            for (var i = 0; i < array.length; i++) {
                var testee = array[i];
                if (angular.equals(testee[property], value)) {
                    array.splice(i, 1);
                    return;
                }
            }
        }
    }
}