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
  salade = {
    title: "Salade légère",
    description: "Mélanger les ingrédients.",
    duration: "00:05:00",
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
    ingredient: "citon vert",
    amount: "1",
    unit: "pièce(s)",
  });
  I.have("fridgeIngredient", {
    ingredient: "vinaigre balsamique",
    amount: "100",
    unit: "g",
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
  I.click("Catalogue des recettes");
  I.click("X");
  I.click("Ma prochaine recette");
  I.dontSee("Marinade");
  I.dontSee("Salade");
});

Scenario(
  "Refetch feasible recipes when changing existing fridge ingredients",
  ({ I }) => {
    I.amOnPage("/");
    I.see("Marinade");
    I.click("Supprimer");
    I.click("Ma prochaine recette");
    I.dontSee("Marinade");
    I.dontSee("Salade");
  }
);
