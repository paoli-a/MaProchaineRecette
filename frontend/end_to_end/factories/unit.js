var Factory = require("rosie").Factory;
var faker = require("faker");

module.exports = new Factory()
  .attr("name", () => faker.name.title())
  .attr("abbreviation", () => faker.name.title())
  .attr("rapport", () => faker.random.float())
  .attr("type", () => faker.random.number());
