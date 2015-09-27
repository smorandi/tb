"use strict";

var denormalizer = require("cqrs-eventdenormalizer");

module.exports = denormalizer.defineCollection({
    name: "admins",
    defaultPayload: "payload",
});