///<reference path="../../all.references.ts" />

"use strict";

module services {
    export class LocalStorageService implements interfaces.ILocalStorage {
        static $inject = [injections.angular.$window];

        constructor(private $window:ng.IWindowService) {
        }

        get(key:string):any {
            var value = localStorage.getItem(key);
            return  JSON.parse(value);
        }

        set(key:string, data):void {
            localStorage.setItem(key, JSON.stringify(data));
        }

        remove(key:string):void {
            localStorage.removeItem(key);
        }

        clearAll():void {
            localStorage.clear();
        }
    }
}