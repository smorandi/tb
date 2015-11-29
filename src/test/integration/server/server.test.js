/**
 * Created by Stefano on 11.10.2015.
 */
var assert = require("assert");
var expect = require("expect.js");
var serverService = require("../../../backend/services/server.service.js");
var config = require("../../../backend/config");
var common = require("./../../common");

it("server started, up & running", function (done) {
    var address = serverService.server.address();
    expect(address.port).to.eql(config.server.port);
    done();
});