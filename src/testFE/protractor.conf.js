exports.config = {
    framework: 'mocha',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./e2e/customer.e2e.test.js'],
    baseUrl: 'http://localhost:3000',
    chromeDriver: '../node_modules/chromedriver',
    rootElement: 'body',
    allScriptsTimeout: 11000,
    getPageTimeout: 10000,
    mochaOpts: {
        //ui: 'bdd',
        //reporter: 'list',
        timeout : 10000
    }
};