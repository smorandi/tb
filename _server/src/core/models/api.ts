/**
 * Created by Stefano on 25.07.2015.
 */

module api {
    "use strict";
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
        category: String;
    }

    export interface IUser extends IEntity {
        firstName:String;
        lastName:String;
        role: String;
        joinDate: Date;
    }
}