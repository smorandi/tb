///<reference path="../all.references.ts" />

"use strict";

module constants {
    export var API:string = "/root";

    export module TOASTER {
        export var error = "error";
        export var success = "success";
        export var info = "info";
        export var warning = "warning";
    };

    export module LOCAL_STORAGE {
        export var credentialKey = "credentialToken";
        export var dashboardFilter = "dashboardFilter";
        export var dashboardSearch = "dashboardSearch";
        export var dashboardView = "dashboardView";
        export var basketFilter = "basketFilter";
        export var orderView = "orderView";
    };

    export module FILTER {
        export var basketTile:string = "tile";
        export var basketList:string = "list";
    };

    export module FOOTER_STATE {
        export var orderTile:string = "tile";
        export var orderList:string = "list";
    };

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
        export var users:string = "users";
    };

    export module NAMES {
        export var root:string = "link.name.root";
        export var home:string = "link.name.home";
        export var register:string = "link.name.register";
        export var dashboard:string = "link.name.dashboard";
        export var profile:string = "link.name.profile";
        export var drinks:string = "link.name.drinks";
        export var basket:string = "link.name.basket";
        export var orders:string = "link.name.orders";
        export var system:string = "link.name.system";
        export var users:string = "link.name.users";
    };

    export module STATES {
        export var root:string = "root";
        export var register:string = "root.register";
        export var dashboard:string = "root.dashboard";
        export var home:string = "root.home";
        export var profile:string = "root.home.profile";

        export module drinks {
            export var root:string = "root.home.drinks";
            export var overview:string = "root.home.drinks.overview";
            export var list:string = "root.home.drinks.overview.list";
            export var create:string = "root.home.drinks.overview.list.new";
            export var details:string = "root.home.drinks.overview.list.details";
            export var edit:string = "root.home.drinks.overview.list.details.edit";
        }

        export var basket:string = "root.home.basket";

        export module orders {
            export var root:string = "root.home.orders";
            export var list:string = "root.home.orders.list";
            export var details:string = "root.home.orders.list.details";
        }

        export var system:string = "root.home.system";
        export var users:string = "root.home.users";
    };

    export module LINKS {
        export var root:interfaces.ILink = new models.Link(RELS.root, NAMES.root, STATES.root);
        export var home:interfaces.ILink = new models.Link(RELS.home, NAMES.home, STATES.home);
        export var register:interfaces.ILink = new models.Link(RELS.register, NAMES.register, STATES.register);
        export var dashboard:interfaces.ILink = new models.Link(RELS.dashboard, NAMES.dashboard, STATES.dashboard);
        export var profile:interfaces.ILink = new models.Link(RELS.profile, NAMES.profile, STATES.profile);
        export var drinks:interfaces.ILink = new models.Link(RELS.drinks, NAMES.drinks, STATES.drinks.list);
        export var basket:interfaces.ILink = new models.Link(RELS.basket, NAMES.basket, STATES.basket);
        export var orders:interfaces.ILink = new models.Link(RELS.orders, NAMES.orders, STATES.orders.list);
        export var system:interfaces.ILink = new models.Link(RELS.system, NAMES.system, STATES.system);
        export var users:interfaces.ILink = new models.Link(RELS.users, NAMES.users, STATES.users);
    };

    interface IRelToLinkMap {
        [key: string]: interfaces.ILink;
    };

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
        [RELS.users]: LINKS.users
    };

    export var CATEGORY_IMAGE_MAP = {
        ["beer"]: "assets/images/drinks/beer.jpg",
        ["cocktail"]: "assets/images/drinks/cocktail.jpg",
        ["wine"]: "assets/images/drinks/wine.jpg",
        ["coffee"]: "assets/images/drinks/coffee.jpg",
        ["tea"]: "assets/images/drinks/tea.jpg",
        ["shot"]: "assets/images/drinks/shot.jpg",
        ["soft"]: "assets/images/drinks/soft.jpg"
    };
}
