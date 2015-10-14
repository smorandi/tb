/**
 * Created by Stefano on 11.10.2015.
 */
var assert = require("assert");
var expect = require("expect.js");
var superagent = require("superagent");
var serverService = require("../../backend/services/server.service.js");
var config = require("../../backend/config");
var common = require("./../common");

before(function (done) {
    var clear = true;
    var populate = true;
    serverService.startServer(clear, populate, done);
});

after(function (done) {
    serverService.stopServer(done);
});

common.importTest("server-tests", __dirname, "./server/server.test");
common.importTest("resource-tests", __dirname, "./resources/root.test");
common.importTest("customer-tests", __dirname, "./customer/customer.test");
