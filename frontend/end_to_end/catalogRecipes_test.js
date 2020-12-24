Feature("Catalog ingredients");

BeforeSuite(({ I }) => {
  I.runDjangoCommand("createrecipesfortest");
});

AfterSuite(({ I }) => {
  I.runDjangoCommand("deleterecipes");
});

Before(({ I }) => {
  I.have("catalogRecipe", {
    title: "Marinade de saumon fumé",
    description:
      "Emincez le saumon, l'échalotte et le persil. Ajoutez le vinaigre, l'huile, le citron et un peu de poivre. Mélangez et laissez mariner toute la nuit.",
    duration: "00:35:00",
    categories: ["Entrée"],
    ingredients: [
      {
        ingredient: "saumon fumé",
        amount: "200",
        unit: "g",
      },
      {
        ingredient: "citon vert",
        amount: "0.5",
        unit: "pièce(s)",
      },
      {
        ingredient: "vinaigre balsamique",
        amount: "2",
        unit: "cas",
      },
      {
        ingredient: "huile d'olive",
        amount: "2",
        unit: "cas",
      },
      {
        ingredient: "échalotte",
        amount: "1",
        unit: "pièce(s)",
      },
      {
        ingredient: "herbes fraiches",
        amount: "1",
        unit: "pièce(s)",
      },
    ],
  });
});

Scenario("See existing recipe", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des recettes");
  I.see("Marinade de saumon fumé");
});

/*
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
*/
