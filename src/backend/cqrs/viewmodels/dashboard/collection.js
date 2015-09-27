"use strict";

var denormalizer = require("cqrs-eventdenormalizer");

module.exports = denormalizer.defineCollection({
    name: "dashboard",
    defaultPayload: "payload",
});