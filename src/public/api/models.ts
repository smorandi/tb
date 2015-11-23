///<reference path="../all.references.ts" />

"use strict";

module models {
    export class Credentials implements interfaces.ICredentials {
        constructor(public loginname?:string, public password?:string) {
        }
    }

    export class Link implements interfaces.ILink {
        constructor(public rel:string, public name:string, public state:string) {
        }
    }

    export class RegisterCustomer implements interfaces.IRegisterCustomer {
        constructor(public firstname?:string,
                    public lastname?:string,
                    public loginname?:string,
                    public password?:string) {
        }
    }

    export class UserProfile implements interfaces.IUserProfile {
        constructor(public firstname?:string,
                    public lastname?:string,
                    public loginname?:string,
                    public password?:string,
                    public type?:string,
                    public creationDate?:Date,
                    public modificationDate?:Date) {
        }
    }

    export class BasketEntry implements interfaces.IBasketEntry {
        constructor(public drinkId:string, public number:number) {
        }
    }

    export class SystemProperties implements interfaces.ISystemProperties {
        constructor(public priceReductionInterval?:number,
                    public priceReductionGracePeriod?:number) {
        }
    }
    export class DrinkProperties implements interfaces.IDrinkProperties {
        constructor(
            public name?: string,
            public description?: string,
            public alcoholic?: boolean,
            public quantity?: number,
            public quantityUnit?: any,
            public basePrice?: number,
            public minPrice?: number,
            public maxPrice?: number,
            public priceStep?: number,
            public category?: any
            ) {
        }
    }
}