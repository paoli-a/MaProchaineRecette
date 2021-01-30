Feature("Catalog ingredients");

Before(({ I }) => {
  I.have("catalogIngredient", { name: "Carottes" });
});

Scenario("See existing ingredient", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des ingrédients");
  I.see("Carottes");
});

Scenario("Add new ingredient", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des ingrédients");
  I.fillField("Nom de l'ingrédient à ajouter :", "Navets");
  I.click("Envoyer");
  within(".catalog-ingredients", () => {
    I.see("Carottes");
    I.see("Navets");
  });
  I.sendDeleteRequest("catalogs/ingredients/Navets/");
});

Scenario("Remove ingredient", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des ingrédients");
  I.click("X");
  I.dontSee("Carottes");
});

Scenario(
  `Take into account newly entered ingredient in the catalog by giving
suggestions when an ingredient name is being entered in FridgeIngredients`,
  ({ I }) => {
    I.amOnPage("/");
    I.click("Catalogue des ingrédients");
    I.fillField("Nom de l'ingrédient à ajouter :", "Navets");
    I.click("Envoyer");
    I.click("Ma prochaine recette");
    I.fillField("Nom de l'ingrédient :", "Nav");
    I.seeElementInDOM("option[value='Navets']");
    I.click("Catalogue des ingrédients");
    I.click("X");
    I.click("X");
  }
);

Scenario(
  `Take into account newly entered ingredient in the catalog by giving
suggestions when an ingredient name is being entered in CatalogRecipes`,
  ({ I }) => {
    I.amOnPage("/");
    I.click("Catalogue des ingrédients");
    I.fillField("Nom de l'ingrédient à ajouter :", "Navets");
    I.click("Envoyer");
    I.click("Catalogue des recettes");
    I.fillField("Nom :", "Nav");
    I.seeElementInDOM("option[value='Navets']");
    I.click("Catalogue des ingrédients");
    I.click("X");
    I.click("X");
  }
);
