/**
 * Created by Stefano on 11.10.2015.
 */
var assert = require("assert");
var expect = require("expect.js");
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


// general server tests...
common.importTest("server-tests", __dirname, "./server/server.test");

// all tests on resource level...
common.importTest("resource-tests", __dirname, "./resources/_all.test");

// tests for use-cases...
common.importTest("use-cases-tests", __dirname, "./use-cases/_all.test");
