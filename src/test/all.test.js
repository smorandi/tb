/**
 * Created by Stefano on 11.10.2015.
 */
var assert = require("assert");
var expect = require("expect.js");
var superagent = require("superagent");
var config = require("../backend/config");
var common = require("./common");

describe("all server tests", function () {
    //common.importTest("unit tests", __dirname, './unit/unit.test');
    common.importTest("integration tests", __dirname, './integration/integration.test');
});