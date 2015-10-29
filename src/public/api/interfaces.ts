/**
 * Created by Stefano on 23.10.2015.
 */
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
}