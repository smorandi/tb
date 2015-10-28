/**
 * Created by Stefano on 23.10.2015.
 */
module interfaces {
    export interface IPage {
        name:string;
        state:string;
    }

    export interface ILoginInfo {
        loggedIn:boolean;
        loginname:string;
        numberOfBasketItems:number;
        hasRegistrationPage:boolean;
    }

    //interface IMapOfPages {
    //    [key: string]: interfaces.IPage;
    //}
    //
    export interface ILink {
        rel:string;
        name:string;
        state:string;
    }
}