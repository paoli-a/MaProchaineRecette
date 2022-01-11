Feature("My next recipes");

BeforeSuite(({ I }) => {
  I.runDjangoCommand("createrecipesfortest");
});

AfterSuite(({ I }) => {
  I.runDjangoCommand("deleterecipes");
});

let marinade;
let salade;

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
  salade = {
    title: "Salade légère",
    description: "Mélanger les ingrédients.",
    duration: "00:05",
    categories: ["Entrée"],
    ingredients: [
      {
        ingredient: "échalotte",
        amount: "1",
        unit: "pièce(s)",
      },
      {
        ingredient: "herbes fraiches",
        amount: "1.5",
        unit: "pièce(s)",
      },
    ],
  };
  I.have("catalogRecipe", marinade);
  I.have("catalogRecipe", salade);
  I.have("fridgeIngredient", {
    ingredient: "saumon fumé",
    amount: "400",
    unit: "g",
  });
  I.have("fridgeIngredient", {
    ingredient: "citron vert",
    amount: "1",
    unit: "pièce(s)",
  });
  I.have("fridgeIngredient", {
    ingredient: "vinaigre balsamique",
    amount: "4",
    unit: "cas",
  });
  I.have("fridgeIngredient", {
    ingredient: "huile d'olive",
    amount: "4",
    unit: "cas",
  });
  I.have("fridgeIngredient", {
    ingredient: "échalotte",
    amount: "1",
    unit: "pièce(s)",
  });
  I.have("fridgeIngredient", {
    ingredient: "herbes fraiches",
    amount: "1",
    unit: "pièce(s)",
  });
});

Scenario(
  "See only the recipe that has enough ingredients in the fridge",
  ({ I }) => {
    I.amOnPage("/");
    I.see("Marinade");
    I.dontSee("Salade");
  }
);

Scenario(
  "See the two recipes when enough ingredients exist in the fridge",
  ({ I }) => {
    I.have("fridgeIngredient", {
      ingredient: "herbes fraiches",
      amount: "1",
      unit: "pièce(s)",
    });
    I.amOnPage("/");
    I.see("Marinade");
    I.see("Salade");
  }
);

Scenario("Refetch feasible recipes when changing existing recipes", ({ I }) => {
  I.amOnPage("/");
  I.see("Marinade");
  I.click("Ouvrir le menu");
  I.click("Catalogue recettes");
  I.click(locate("img").withAttr({ alt: "Supprimer" }));
  I.click("Ouvrir le menu");
  I.click("Recettes possibles");
  I.dontSee("Marinade");
  I.dontSee("Salade");
});

Scenario(
  "Refetch feasible recipes when changing existing fridge ingredients",
  ({ I }) => {
    I.amOnPage("/");
    I.see("Marinade");
    I.click(locate("img").withAttr({ alt: "Supprimer" }));
    I.click("Ouvrir le menu");
    I.click("Recettes possibles");
    I.dontSee("Marinade");
    I.dontSee("Salade");
  }
);

Scenario(
  "Consume correctly fridge ingredients when clicking on the consume button of a recipe",
  async ({ I }) => {
    I.amOnPage("/");
    I.see("Marinade");
    I.click("Consommer la recette");
    await within(".fridge-ingredients__list", () => {
      I.see("saumon fumé");
      I.see("200");
      I.see("g");
      I.dontSee("échalotte");
      I.dontSee("herbes fraiches");
      I.see("citron vert");
      I.see("0.5");
      I.dontSee("Marinade");
    });
  }
);

export {};
