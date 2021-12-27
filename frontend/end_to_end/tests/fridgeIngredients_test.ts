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
  I.have("fridgeIngredient", {
    ingredient: "citron vert",
    amount: "2",
    unit: "kg",
  });
});

Scenario("See existing fridge ingredient", ({ I }) => {
  I.amOnPage("/");
  I.see("échalotte");
  I.see("citron vert");
});

Scenario("Add new fridge ingredient", async ({ I }) => {
  I.amOnPage("/");
  I.fillField("Nom de l'ingrédient :", "herbes fraiches");
  I.fillField("Quantité :", "1");
  I.selectOption("Unité", "pièce(s)");
  I.fillField("Date de péremption :", "10102030");
  I.click("Ajouter");
  await within(".fridge-ingredients__list", () => {
    I.see("échalotte");
    I.see("herbes fraiches");
  });
  I.click(locate("img").withAttr({ alt: "Supprimer" }));
  I.click(locate("img").withAttr({ alt: "Supprimer" }));
});

Scenario("Remove fridge ingredient", ({ I }) => {
  I.amOnPage("/");
  I.see("échalotte");
  I.click(
    locate("img")
      .withAttr({ alt: "Supprimer" })
      .inside(locate("li").withChild("h3").withText("échalotte"))
  );
  I.dontSee("échalotte");
}).retry(2);

Scenario(
  `Add new fridge ingredient, and navigate between tabs : the ingredient is
still there`,
  async ({ I }) => {
    I.amOnPage("/");
    I.fillField("Nom de l'ingrédient :", "herbes fraiches");
    I.fillField("Quantité :", "1");
    I.selectOption("Unité", "pièce(s)");
    I.fillField("Date de péremption :", "10102030");
    I.click("Ajouter");
    I.click("Catalogue des recettes");
    I.click("Ma prochaine recette");
    await within(".fridge-ingredients__list", () => {
      I.see("échalotte");
      I.see("herbes fraiches");
    });
    I.click(locate("img").withAttr({ alt: "Supprimer" }));
    I.click(locate("img").withAttr({ alt: "Supprimer" }));
  }
);

Scenario("Edit existing fridge ingredient", async ({ I }) => {
  I.amOnPage("/");
  I.click(
    locate("img")
      .withAttr({ alt: "Modifier" })
      .inside(locate("li").withChild("h3").withText("échalotte"))
  );
  I.click(
    locate("img")
      .withAttr({ alt: "Modifier" })
      .inside(locate("li").withChild("h3").withText("citron vert"))
  );
  I.fillField("Quantité :", "6");
  I.selectOption("Unité", "g");
  I.fillField("Date de péremption :", "10102033");
  I.click("Modifier");
  await within(".fridge-ingredients__list", () => {
    I.see("citron vert");
    I.see("6");
    I.see("g");
    I.see("échalotte");
    I.see("1");
  });
});

export {};
