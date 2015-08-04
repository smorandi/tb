/**
 * Created by Stefano on 03.08.2015.
 */
///<reference path="../../typings/tsd.d.ts" />
///<reference path="../../../_server/src/core/models/api.ts" />


module services {
    export interface IDrinkResource extends api.IDrink, ng.resource.IResource<IDrinkResource> {
    }

    export interface IDrinkResourceClass extends ng.resource.IResourceClass<IDrinkResource> {
        update(drink:IDrinkResource) : IDrinkResource;
    }

    angular.module("services", ["ngResource"]).factory("services.drinkResource", ($resource:ng.resource.IResourceService):IDrinkResourceClass => {

        // Define your custom actions here as IActionDescriptor
        var updateAction:ng.resource.IActionDescriptor = {
            method: "PUT",
            isArray: false
        };

        // Return the resource, include your custom actions
        return <IDrinkResourceClass> $resource("http://localhost:3000/drinks/:id", {id: "@_id"}, {
            update: updateAction
        });
    }).service("services.popupService", function ($window) {
        this.showPopup = function (message) {
            return $window.confirm(message);
        }
    });
}