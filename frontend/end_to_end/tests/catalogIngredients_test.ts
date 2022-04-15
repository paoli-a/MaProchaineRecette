Feature("Catalog ingredients");

Before(({ I }) => {
  I.have("catalogIngredient", { name: "Carottes" });
});

Scenario("See existing ingredient", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue ingrédients");
  I.see("Carottes");
});

Scenario("Add new ingredient", async ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue ingrédients");
  I.fillField("Nom de l'ingrédient", "Navets");
  I.click("Ajouter");
  await within("$catalogIngredientsList", () => {
    I.see("Carottes");
    I.see("Navets");
  });
  I.sendDeleteRequest("catalogs/ingredients/Navets/");
});

Scenario("Remove ingredient", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue ingrédients");
  I.click("Supprimer l'ingrédient");
  I.dontSee("Carottes");
});

Scenario(
  `Add new ingredient, and navigate between tabs : the ingredient is
still there`,
  async ({ I }) => {
    I.amOnPage("/");
    I.click("Catalogue ingrédients");
    I.fillField("Nom de l'ingrédient", "Navets");
    I.click("Ajouter");
    I.click("Recettes possibles");
    I.click("Catalogue recettes");
    I.click("Catalogue ingrédients");
    await within("$catalogIngredientsList", () => {
      I.see("Carottes");
      I.see("Navets");
    });
    I.sendDeleteRequest("catalogs/ingredients/Navets/");
  }
);

Scenario(
  `Take into account newly entered ingredient in the catalog by giving
suggestions when an ingredient name is being entered in FridgeIngredients`,
  ({ I }) => {
    I.amOnPage("/");
    I.click("Catalogue ingrédients");
    I.fillField("Nom de l'ingrédient", "Navets");
    I.click("Ajouter");
    I.click("Recettes possibles");
    I.fillField("Nom de l'ingrédient", "Nav");
    I.seeElementInDOM("option[value='Navets']");
    I.click("Catalogue ingrédients");
    I.click("Supprimer l'ingrédient");
    I.click("Supprimer l'ingrédient");
  }
).retry(2);

Scenario(
  `Take into account newly entered ingredient in the catalog by giving
suggestions when an ingredient name is being entered in CatalogRecipes`,
  ({ I }) => {
    I.amOnPage("/");
    I.click("Catalogue ingrédients");
    I.fillField("Nom de l'ingrédient", "Navets");
    I.click("Ajouter");
    I.click("Catalogue recettes");
    I.fillField("Nom", "Nav");
    I.seeElementInDOM("option[value='Navets']");
    I.click("Catalogue ingrédients");
    I.click("Supprimer l'ingrédient");
    I.click("Supprimer l'ingrédient");
  }
).retry(2);

export {};
