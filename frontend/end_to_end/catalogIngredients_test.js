Feature("Catalog ingredients");

Before(({ I }) => {
  I.have("catalogIngredient", { name: "Carottes" });
  I.have("catalogCategory", { name: "Entrée" });
  I.have("catalogRecipe", {
    title: "Salade de carottes",
    ingredients: [0],
    categories: [0],
  });
  I.have("unitType", { name: "masse" });
  I.have("unit", {
    name: "gramme",
    abbreviation: "g",
    rapport: "1.0",
    type: 0,
  });
});

Scenario("test something", ({ I }) => {
  I.amOnPage("/");
  //pause();
  I.see("recettes");
  I.click("Catalogue des ingrédients");
  I.see("Carottes");
});
