/* eslint-disable @typescript-eslint/no-var-requires */
var Factory = require("rosie").Factory;
var faker = require("faker");

module.exports = new Factory()
  .attr("title", () => faker.name.title())
  .attr("description", () => faker.lorem.paragraphs())
  .attr("duration", () => faker.random.float())
  .attr("ingredients", () => faker.lorem.words())
  .attr("categories", () => faker.lorem.words());
