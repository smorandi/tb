/**
 * Created by Stefano on 25.07.2015.
 */
"use strict";

import api = require("../models/api");

export function createFromEntity<R extends api.IResource>(entity:api.IEntity, links:Array<api.ILink>):R {
    // a bit of magic here...we are going to "dynmaically" add the links to the entity in a new object, which
    // will be cast afterwards.
    var r = new Object();
    for (var k in entity) {
        r[k] = entity[k];
    };
    r["_links"] = links;

    return <R>r;
};