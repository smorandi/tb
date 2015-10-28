///<reference path="../all.references.ts" />

module models {
    export class Page implements interfaces.IPage {
        constructor(public name:string, public state:string) {
        }
    }

    export class Link implements interfaces.ILink {
        constructor(public rel:string, public name:string, public state:string) {
        }
    }

    export class LoginInfo implements interfaces.ILoginInfo {
        constructor(public loggedIn:boolean, public loginname:string, public numberOfBasketItems:number, public hasRegistrationPage:boolean) {
        }
    }
}