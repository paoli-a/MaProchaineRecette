Feature("Catalog recipes");

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
    duration: "00:35",
    categories: ["Entrée"],
    ingredients: [
      {
        ingredient: "saumon fumé",
        amount: "200",
        unit: "g",
      },
      {
        ingredient: "citron vert",
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
  I.fillField("Temps total de la recette :", "010101");
  I.fillField("Nom :", "échalotte");
  I.fillField("Quantité nécessaire :", "1");
  I.selectOption("Unité", "pièce(s)");
  I.click("Ajouter");
  I.fillField("Nom :", "herbes fraiches");
  I.fillField("Quantité nécessaire :", "1");
  I.selectOption("Unité", "pièce(s)");
  I.click("Ajouter");
  I.fillField("Corps de la recette :", "Mélanger les ingrédients.");
  within(".form__paragraph", () => {
    I.click(".form__submit");
  });
  within(".display-catalog-recipe", () => {
    I.see("Marinade");
    I.see("Salade légère");
  });
  I.click(locate("img").withAttr({ alt: "Supprimer" }));
  I.click(locate("img").withAttr({ alt: "Supprimer" }));
});

Scenario("Remove recipe", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des recettes");
  I.see("Marinade");
  I.click(locate("img").withAttr({ alt: "Supprimer" }));
  I.dontSee("Marinade");
});

Scenario(
  `Add new recipe, and navigate between tabs : the recipe is still
there`,
  ({ I }) => {
    I.amOnPage("/");
    I.click("Catalogue des recettes");
    I.fillField("Titre de la recette :", "Salade légère");
    I.checkOption("Entrée");
    I.fillField("Temps total de la recette :", "010101");
    I.fillField("Nom :", "échalotte");
    I.fillField("Quantité nécessaire :", "1");
    I.selectOption("Unité", "pièce(s)");
    I.click("Ajouter");
    I.fillField("Nom :", "herbes fraiches");
    I.fillField("Quantité nécessaire :", "1");
    I.selectOption("Unité", "pièce(s)");
    I.click("Ajouter");
    I.fillField("Corps de la recette :", "Mélanger les ingrédients.");
    within(".form__paragraph", () => {
      I.click(".form__submit");
    });
    I.click("Ma prochaine recette");
    I.click("Catalogue des recettes");
    within(".display-catalog-recipe", () => {
      I.see("Marinade");
      I.see("Salade légère");
    });
    I.click(locate("img").withAttr({ alt: "Supprimer" }));
    I.click(locate("img").withAttr({ alt: "Supprimer" }));
  }
);

Scenario("Edit existing catalog recipe", ({ I }) => {
  I.amOnPage("/");
  I.click("Catalogue des recettes");
  I.click(locate("img").withAttr({ alt: "Modifier" }));
  I.fillField("Titre de la recette :", "Marinade de saumon express");
  I.fillField("Nom :", "ciboulette");
  I.fillField("Quantité nécessaire :", "1");
  I.selectOption("Unité", "pièce(s)");
  I.click("Ajouter");
  I.fillField(
    "Corps de la recette :",
    "Emincez l'échalotte, le saumon et le persil."
  );
  within(".form__paragraph", () => {
    I.click(".form__submit");
  });
  I.click("Modifier");
  I.click("Marinade de saumon express");
  within(".display-catalog-recipe", () => {
    I.see("Marinade de saumon express");
    I.see("ciboulette");
    I.see("Emincez l'échalotte, le saumon et le persil.");
  });
});
