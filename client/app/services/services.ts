/**
 * Created by Stefano on 03.08.2015.
 */
///<reference path="../../typings/tsd.d.ts" />

module services {
    export interface IDrink extends api.IDrinkResource, ng.resource.IResource<IDrink> {
    }

    export interface IDrinkResource extends ng.resource.IResourceClass<IDrink> {
        update(drink:IDrink) : IDrink;
    }

    angular.module("services", ["ngResource"]).factory("services.drinkResource", ($resource:ng.resource.IResourceService):IDrinkResource => {

        // Define your custom actions here as IActionDescriptor
        var updateAction:ng.resource.IActionDescriptor = {
            method: "PUT",
            isArray: false
        };

        // Return the resource, include your custom actions
        return <IDrinkResource> $resource("http://localhost:3000/drinks/:id", {id: "@_id"}, {
            update: updateAction
        });
    }).service("services.popupService", function ($window) {
        this.showPopup = function (message) {
            return $window.confirm(message);
        }
    });
}