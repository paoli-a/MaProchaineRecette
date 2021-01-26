var Factory = require("rosie").Factory;
var faker = require("faker");

module.exports = new Factory()
  .attr("ingredient", () => faker.name.title())
  .attr("expiration_date", () => faker.date.future().toISOString().slice(0, 10))
  .attr("amount", () => faker.random.float())
  .attr("unit", () => faker.name.title());
