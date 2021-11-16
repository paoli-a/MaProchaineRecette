/* eslint-disable @typescript-eslint/no-var-requires */
var Factory = require("rosie").Factory;
var faker = require("faker");

module.exports = new Factory().attr("name", () => faker.name.title());
