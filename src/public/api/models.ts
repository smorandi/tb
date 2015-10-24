/**
 * Created by Stefano on 23.10.2015.
 */
///<reference path="../all.references.ts" />

module models {
    export class Page implements interfaces.IPage {
        constructor(public name:string, public state:string) {
        }
    }
}