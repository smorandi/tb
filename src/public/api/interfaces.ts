///<reference path="../all.references.ts" />

"use strict";

module interfaces {
    export interface ICredentials {
        loginname:string;
        password:string;
    }

    export interface ILink {
        rel:string;
        name:string;
        state:string;
    }

    export interface IRegisterCustomer {
        firstname: string;
        lastname: string;
        loginname: string;
        password: string;
    }

    export interface IUserProfile extends IRegisterCustomer {
        type: string;
        creationDate: Date;
        modificationDate: Date;
    }


    export interface ILocalStorage {
        get(key:string): any;
        set(key:string, data:any): void;
        remove(key:string): void;
        clearAll(): void;
    }

    export interface ILogger {
        error(title:string, message?:string, logOptions?:enums.LogOptions):void;
        debug(title:string, message?:string, logOptions?:enums.LogOptions):void;
        info(title:string, message?:string, logOptions?:enums.LogOptions):void;
        warn(title:string, message?:string, logOptions?:enums.LogOptions):void;
    }

    export interface IBasketEntry {
        drinkId: string;
        number: number;
    }

    export interface ISystemProperties {
        priceReductionInterval: number;
        priceReductionGracePeriod: number;
    }
}