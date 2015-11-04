///<reference path="../all.references.ts" />

"use strict";

module constants {
    export var ws:string = "http://localhost:3000";
    export var api:string = "http://localhost:3000/root";

    export module toaster {
        export var error = "error";
        export var success = "success";
        export var info = "info";
        export var warning = "warning";
    }

    export module localstorage {
        export var credentialKey = "credentialToken";
    }

    export module RELS {
        export var root:string = "root";
        export var home:string = "home";
        export var register:string = "register";
        export var dashboard:string = "dashboard";
        export var profile:string = "profile";
        export var drinks:string = "drinks";
        export var basket:string = "basket";
        export var orders:string = "orders";
        export var system:string = "system";
    }

    export module NAMES {
        export var root:string = "Root";
        export var home:string = "Home";
        export var register:string = "Sign Up";
        export var dashboard:string = "Dashboard";
        export var profile:string = "Profile";
        export var drinks:string = "Drinks";
        export var basket:string = "Basket";
        export var orders:string = "Orders";
        export var system:string = "System";
    }

    export module STATES {
        export var root:string = "root";
        export var register:string = "root.register";
        export var dashboard:string = "root.dashboard.all";
        export var home:string = "root.home";
        export var profile:string = "root.home.profile";
        export var drinks:string = "root.home.drinks.overview.list";
        export var basket:string = "root.home.basket";
        export var orders:string = "root.home.orders.overview.list";
        export var system:string = "root.home.system";
    }

    export module LINKS {
        export var root:interfaces.ILink = new models.Link(RELS.root, NAMES.root, STATES.root);
        export var home:interfaces.ILink = new models.Link(RELS.home, NAMES.home, STATES.home);
        export var register:interfaces.ILink = new models.Link(RELS.register, NAMES.register, STATES.register);
        export var dashboard:interfaces.ILink = new models.Link(RELS.dashboard, NAMES.dashboard, STATES.dashboard);
        export var profile:interfaces.ILink = new models.Link(RELS.profile, NAMES.profile, STATES.profile);
        export var drinks:interfaces.ILink = new models.Link(RELS.drinks, NAMES.drinks, STATES.drinks);
        export var basket:interfaces.ILink = new models.Link(RELS.basket, NAMES.basket, STATES.basket);
        export var orders:interfaces.ILink = new models.Link(RELS.orders, NAMES.orders, STATES.orders);
        export var system:interfaces.ILink = new models.Link(RELS.system, NAMES.system, STATES.system);
    }

    interface IRelToLinkMap {
        [key: string]: interfaces.ILink;
    }

    export var REL_TO_LINK_MAP:IRelToLinkMap = {
        [RELS.root]: LINKS.root,
        [RELS.home]: LINKS.home,
        [RELS.register]: LINKS.register,
        [RELS.profile]: LINKS.profile,
        [RELS.dashboard]: LINKS.dashboard,
        [RELS.drinks]: LINKS.drinks,
        [RELS.system]: LINKS.system,
        [RELS.basket]: LINKS.basket,
        [RELS.orders]: LINKS.orders,
    }
}
