Feature("Catalog ingredients");

BeforeSuite(({ I }) => {
  I.runDjangoCommand("createrecipesfortest");
});

AfterSuite(({ I }) => {
  I.runDjangoCommand("deleterecipes");
});

let marinade;

Before(({ I }) => {
  marinade = {
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
  };
  I.have("catalogRecipe", marinade);
});

Scenario("See existing recipe", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des recettes");
  I.see("Marinade de saumon fumé");
});

Scenario("Add new recipe", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des recettes");
  I.fillField("Titre de la recette :", "Salade légère");
  I.checkOption("Entrée");
  I.fillField("Temps total de la recette :", "0100");
  I.fillField("Nom :", "échalotte");
  I.fillField("Quantité nécessaire :", "1");
  I.selectOption("Unité", "pièce(s)");
  I.click("Ajouter");
  I.fillField("Nom :", "herbes fraiches");
  I.fillField("Quantité nécessaire :", "1");
  I.selectOption("Unité", "pièce(s)");
  I.click("Ajouter");
  I.fillField("Corps de la recette :", "Mélanger les ingrédients.");
  I.click("Confirmer");
  within(".display-catalog-recipe", () => {
    I.see("Marinade");
    I.see("Salade légère");
  });
  I.click("X");
  I.click("X");
});

Scenario("Remove recipe", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des recettes");
  I.see("Marinade");
  I.click("X");
  I.dontSee("Marinade");
});
