///<reference path="../all.references.ts" />

module constants {
    export var ws:string = "http://localhost:3000";
    export var api:string = "http://localhost:3000/root";

    export var pages:any =
    {
        home: new models.Page("Home", "root.home"),
        register: new models.Page("RegisterCustomer", "root.registerCustomer"),
        profile: new models.Page("Profile", "root.home.profile"),
        dashboard: new models.Page("Dashboard", "root.dashboard"),
        drinks: new models.Page("Drinks", "root.home.drinks.overview.list"),
        system: new models.Page("System", "root.home.system")
    };
}
