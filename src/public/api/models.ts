///<reference path="../all.references.ts" />

module models {
    export class Credentials implements interfaces.ICredentials {
        constructor(public loginname:string, public password:string) {
        }
    }

    export class Link implements interfaces.ILink {
        constructor(public rel:string, public name:string, public state:string) {
        }
    }

    export class RegisterCustomer implements interfaces.IRegisterCustomer {
        constructor(public firstname?:string, public lastname?:string, public loginname?:string, public password?:string) {
        }
    }
}