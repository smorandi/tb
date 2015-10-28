///<reference path="../all.references.ts" />

module constants {
    export var ws:string = "http://localhost:3000";
    export var api:string = "http://localhost:3000/root";


    export class RELS {
        public static root:string = "root";
        public static home:string = "home";
        public static register:string = "register";
        public static dashboard:string = "dashboard";
        public static profile:string = "profile";
        public static drinks:string = "drinks";
        public static basket:string = "basket";
        public static orders:string = "orders";
        public static system:string = "system";
    }

    export class STATES {
        public static root:string = "root";
        public static register:string = "root.register";
        public static dashboard:string = "root.dashboard";
        public static home:string = "root.home";
        public static profile:string = "root.home.profile";
        public static drinks:string = "root.home.drinks.overview.list";
        public static basket:string = "root.home.basket";
        public static orders:string = "root.home.orders";
        public static system:string = "root.home.system";
    }

    export class LINKZ {
        public static root:interfaces.ILink = new models.Link(RELS.root, "Root", STATES.root);
        public static home:interfaces.ILink = new models.Link(RELS.home, "Home", STATES.home);
        public static register:interfaces.ILink = new models.Link(RELS.register,"Sign Up", STATES.register);
        public static dashboard:interfaces.ILink = new models.Link(RELS.dashboard,"Dashboard", STATES.dashboard);
        public static profile:interfaces.ILink = new models.Link(RELS.profile,"Profile", STATES.profile);
        public static drinks:interfaces.ILink = new models.Link(RELS.drinks,"Drinks", STATES.drinks);
        public static basket:interfaces.ILink = new models.Link(RELS.basket,"Basket", STATES.basket);
        public static orders:interfaces.ILink = new models.Link(RELS.orders,"Orders", STATES.orders);
        public static system:interfaces.ILink = new models.Link(RELS.system,"System", STATES.system);
    }

    interface IRelToLinkMap {
        [key: string]: interfaces.ILink;
    }

    export var REL_TO_LINK_MAP:IRelToLinkMap = {
        [RELS.root]: LINKZ.root,
        [RELS.home]: LINKZ.home,
        [RELS.register]: LINKZ.register,
        [RELS.profile]: LINKZ.profile,
        [RELS.dashboard]: LINKZ.dashboard,
        [RELS.drinks]: LINKZ.drinks,
        [RELS.system]: LINKZ.system,
        [RELS.basket]: LINKZ.basket,
        [RELS.orders]: LINKZ.orders,
    }



    export class LINKS {
        public static root:string = "root";
        public static home:string = "home";
        public static register:string = "register";
        public static dashboard:string = "dashboard";
        public static profile:string = "profile";
        public static drinks:string = "drinks";
        public static basket:string = "basket";
        public static orders:string = "orders";
        public static system:string = "system";
    }

    export class NAMES {
        public static root:string = "Root";
        public static home:string = "Home";
        public static register:string = "Sign Up";
        public static dashboard:string = "Dashboard";
        public static profile:string = "Profile";
        public static drinks:string = "Drinks";
        public static basket:string = "Basket";
        public static orders:string = "Orders";
        public static system:string = "System";
    }

    //export class PAGES {
    //    public static home:interfaces.IPage = new models.Page("Home", STATES.home);
    //    public static register:interfaces.IPage = new models.Page("Sign Up", STATES.register);
    //    public static dashboard:interfaces.IPage = new models.Page("Dashboard", STATES.dashboard);
    //    public static profile:interfaces.IPage = new models.Page("Profile", STATES.profile);
    //    public static drinks:interfaces.IPage = new models.Page("Drinks", STATES.drinks);
    //    public static basket:interfaces.IPage = new models.Page("Basket", STATES.basket);
    //    public static orders:interfaces.IPage = new models.Page("Orders", STATES.orders);
    //    public static system:interfaces.IPage = new models.Page("System", STATES.system);
    //}

    interface ILinkToStateMap {
        [key: string]: string;
    }

    export var LINK_TO_STATE_MAP:ILinkToStateMap = {
        [LINKS.home]: STATES.home,
        [LINKS.register]: STATES.register,
        [LINKS.profile]: STATES.profile,
        [LINKS.dashboard]: STATES.dashboard,
        [LINKS.drinks]: STATES.drinks,
        [LINKS.system]: STATES.system,
        [LINKS.basket]: STATES.basket,
        [LINKS.orders]: STATES.orders,
    }

    interface ILinkToNameMap {
        [key: string]: string;
    }

    export var LINK_TO_NAME_MAP:ILinkToNameMap = {
        [LINKS.root]: NAMES.root,
        [LINKS.home]: NAMES.home,
        [LINKS.register]: NAMES.register,
        [LINKS.profile]: NAMES.profile,
        [LINKS.dashboard]: NAMES.dashboard,
        [LINKS.drinks]: NAMES.drinks,
        [LINKS.system]: NAMES.system,
        [LINKS.basket]: NAMES.basket,
        [LINKS.orders]: NAMES.orders,
    }
}
