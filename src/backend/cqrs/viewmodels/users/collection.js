"use strict";

var denormalizer = require("cqrs-eventdenormalizer");

module.exports = denormalizer.defineCollection({
    name: "users",
    defaultPayload: "payload",
});