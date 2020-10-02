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
  within("#CatalogIngredients", () => {
    I.see("Carottes");
    I.see("Navets");
  });
});

Scenario("Remove ingredient", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des ingrédients");
  I.click("X");
  I.dontSee("Carottes");
});
