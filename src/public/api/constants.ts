///<reference path="../all.references.ts" />

"use strict";

module constants {
    export var API:string = "/root";

    export module TOASTER {
        export var error = "error";
        export var success = "success";
        export var info = "info";
        export var warning = "warning";
    }

    export module LOCAL_STORAGE {
        export var credentialKey = "credentialToken";
        export var dashboardFilter = "dashboardFilter";
        export var dashboardSearch = "dashboardSearch";
        export var dashboardView = "dashboardView";
        export var basketFilter = "basketFilter";
        export var orderView = "orderView";
    }

    export module FILTER {
        export var basketTile:string = "tile";
        export var basketList:string = "list";
    }

    export module FOOTER_STATE {
        export var orderTile:string = "tile";
        export var orderList:string = "list";
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
        export var dashboard:string = "root.dashboard";
        export var home:string = "root.home";
        export var profile:string = "root.home.profile";
        export var drinks:string = "root.home.drinks.overview.list";
        export var basket:string = "root.home.basket";
        export var orders:string = "root.home.orders.list";
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

    export var CATEGORY_IMAGE_MAP = {
        ["beer"]: "assets/images/drinks/beer.jpg",
        ["cocktail"]: "assets/images/drinks/cocktail.jpg",
        ["wine"]: "assets/images/drinks/wine.jpg",
        ["coffee"]: "assets/images/drinks/coffee.jpg",
        ["tea"]: "assets/images/drinks/tea.jpg",
        ["shot"]: "assets/images/drinks/shot.jpg",
        ["soft"]: "assets/images/drinks/soft.jpg",
    }
}
