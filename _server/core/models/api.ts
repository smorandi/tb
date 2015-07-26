/**
 * Created by Stefano on 25.07.2015.
 */
"use strict";

//______________________________________________________________________________________________________________________
// entities...
export enum Category {SoftDrink, Beer, Cocktail};

export interface IEntity {
    _id:any;
}

export interface IDrink extends IEntity {
    name:string;
    description:string;
    alcoholic:boolean;
    quantity:string;
    price:number;
    category: Category;
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

export class Link implements ILink {
    rel:string;
    url:string;
    method:string;

    constructor(rel:string, url:string, method:string) {
        this.rel = rel;
        this.url = url;
        this.method = method;
    }
}