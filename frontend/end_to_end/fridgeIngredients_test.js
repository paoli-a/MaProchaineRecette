Feature("Fridge ingredients");

BeforeSuite(({ I }) => {
  I.runDjangoCommand("createrecipesfortest");
});

AfterSuite(({ I }) => {
  I.runDjangoCommand("deleterecipes");
});

Before(({ I }) => {
  I.have("fridgeIngredient", {
    ingredient: "échalotte",
    amount: "1",
    unit: "pièce(s)",
  });
});

Scenario("See existing fridge ingredient", ({ I }) => {
  I.amOnPage("/");
  I.see("échalotte");
});

Scenario("Add new fridge ingredient", ({ I }) => {
  I.amOnPage("/");
  I.fillField("Nom de l'ingrédient :", "herbes fraiches");
  I.fillField("Quantité :", "1");
  I.selectOption("Unité", "pièce(s)");
  I.fillField("Date de péremption :", "10102030");
  I.click("Confirmer");
  within(".fridge-ingredients__list", () => {
    I.see("échalotte");
    I.see("herbes fraiches");
  });
  I.click("Supprimer");
  I.click("Supprimer");
});

Scenario("Remove fridge ingredient", ({ I }) => {
  I.amOnPage("/");
  I.see("échalotte");
  I.click("Supprimer");
  I.dontSee("échalotte");
}).retry(2);
