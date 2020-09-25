Feature("ingredients");

Scenario("test something", ({ I }) => {
  I.amOnPage("/");
  I.see("recettes");
});
