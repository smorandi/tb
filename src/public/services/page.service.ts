///<reference path="../all.references.ts" />

module services {
    export class PageService {
        private pages:Array<interfaces.IPage>;

        constructor(private $log:ng.ILogService) {
            this.pages = [];
        }

        public getPages():Array<interfaces.IPage> {
            return this.pages;
        }

        public setResource(resource:any) {
            this.pages.length = 0;

            if (resource.$has("home")) {
                this.pages.push(new models.Page("Login", "root.home"));
            }
            if (resource.$has("dashboard")) {
                this.pages.push(new models.Page("Dashboard", "root.dashboard"));
            }
            if (resource.$has("registerCustomer")) {
                this.pages.push(new models.Page("RegisterCustomer", "root.registerCustomer"));
            }
            if (resource.$has("drinks")) {
                this.pages.push(new models.Page("Drinks", "root.home.drinks.overview.list"));
            }
            if (resource.$has("system")) {
                this.pages.push(new models.Page("System", "root.home.system"));
            }
        }
    }
}
