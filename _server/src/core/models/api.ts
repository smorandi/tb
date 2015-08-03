/**
 * Created by Stefano on 25.07.2015.
 */
module api {
    "use strict";

    export enum Category {SoftDrink, Beer, Cocktail}
    export enum Role {Customer, Manager}

//______________________________________________________________________________________________________________________
// entities...
    export interface IEntity {
        _id:any;
    }

    export interface IDrink extends IEntity {
        name:String;
        description:String;
        alcoholic:Boolean;
        quantity:String;
        price:Number;
        category: Category;
    }

    export interface IUser extends IEntity {
        firstName:String;
        lastName:String;
        role: Role;
        joinDate: Date;
    }

//______________________________________________________________________________________________________________________
// resources...
    export interface ILink {
        rel:string;
        url:string;
        method:string;
    }

    export interface IResource {
        _links: Array<ILink>;
    }

    export interface IDrinkResource extends IResource, IDrink {
    }
}