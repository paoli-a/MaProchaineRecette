/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable testing-library/no-await-sync-query */
import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";
import { SWRConfig } from "swr";
import type { GetByType } from "../testUtils";
import {
  axiosGetGlobalMock,
  catalogRecipes,
  mockedAxios,
  recipeCrumble,
} from "../testUtils";
import CatalogRecipes from "./CatalogRecipes";

beforeEach(() => {
  axiosGetGlobalMock();
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderCatalog = async (): Promise<RenderResult> => {
  const view = render(
    <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
      <CatalogRecipes />
    </SWRConfig>
  );
  await waitFor(() => view);
  return view;
};

describe("initial display is correct", () => {
  it("displays provided categories", async () => {
    const { getByText } = await renderCatalog();
    const entree = getByText(/Entrée/);
    const gouter = getByText(/Gouter/);
    expect(entree).toBeInTheDocument();
    expect(gouter).toBeInTheDocument();
  });

  it("displays provided units", async () => {
    const { getByLabelText } = await renderCatalog();
    const unitSelect = getByLabelText("Unité");
    const kg = within(unitSelect).getByText("kg");
    const pieces = within(unitSelect).getByText("pièce(s)");
    expect(kg).toBeInTheDocument();
    expect(pieces).toBeInTheDocument();
  });

  it("displays provided recipes", async () => {
    const { getByText } = await renderCatalog();
    const salade = getByText(/Salade de pommes de terre radis/);
    const marinade = getByText(/Marinade de saumon fumé/);
    expect(salade).toBeInTheDocument();
    expect(marinade).toBeInTheDocument();
  });
});

describe("the adding recipe functionality works properly", () => {
  it("adds the correct recipe when filling the form and clicking on submit", async () => {
    const { getByText } = await renderCatalog();
    mockedAxios.get.mockResolvedValue({
      data: [...catalogRecipes, recipeCrumble],
    });
    await addRecipe();
    const recipe = getByText("Crumble aux poires", { exact: false });
    const beurre = getByText(/Beurre :/);
    expect(recipe).toBeInTheDocument();
    expect(beurre).toBeInTheDocument();
  });

  it(`does not add the recipe if no ingredient was provided`, async () => {
    const { queryByText, getAllByText } = await renderCatalog();
    mockedAxios.get.mockResolvedValue({
      data: [...catalogRecipes, recipeCrumble],
    });
    await addRecipe(["ingredients"]);
    let recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();
    expect(
      getAllByText("Il faut au moins un ingrédient dans la recette")
    ).toHaveLength(1);
    addIngredient(["", "", ""]);
    await addRecipe(["ingredients"]);
    recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();
    expect(
      getAllByText("Il faut au moins un ingrédient dans la recette")
    ).toHaveLength(2);
  });

  it(`does not add the recipe if an incomplete ingredient was provided
  (missing name)`, async () => {
    await checkMissingInput("ingredientName");
    expect(
      screen.getAllByText(
        "Cet ingrédient n'existe pas dans le catalogue d'ingrédients. Vous pouvez l'y ajouter"
      )
    ).toHaveLength(2);
  });

  it(`does not add the recipe if an incomplete ingredient was provided
  (missing amount)`, async () => {
    await checkMissingInput("ingredientAmount");
    expect(screen.getAllByText("Ce champ est obligatoire")).toHaveLength(2);
  });

  it(`does not add the recipe if an incomplete ingredient was provided
  (missing unit)`, async () => {
    await checkMissingInput("ingredientUnit");
    expect(screen.getAllByText("Ce champ est obligatoire")).toHaveLength(2);
  });

  it(`does not add the recipe if no category was provided`, async () => {
    await checkMissingInput("categories");
  });

  it(`does not add the recipe if no duration was provided`, async () => {
    await checkMissingInput("duration");
  });

  it(`does not add the recipe if no description was provided`, async () => {
    await checkMissingInput("description");
  });

  async function checkMissingInput(inputName: string) {
    const { queryByText } = await renderCatalog();
    mockedAxios.get.mockResolvedValue({
      data: [...catalogRecipes, recipeCrumble],
    });
    await addRecipe([inputName]);
    const recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  }

  it(`does not add the recipe if no title was provided`, async () => {
    const { queryByText } = await renderCatalog();
    mockedAxios.get.mockResolvedValue({
      data: [...catalogRecipes, recipeCrumble],
    });
    await addRecipe(["title"]);
    const recipe = queryByText("Épluchez et épépinez", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  });

  it(`does not add the recipe if the duration for the recipe is negative or null`, async () => {
    const { queryByText } = await renderCatalog();
    mockedAxios.get.mockResolvedValue({
      data: [...catalogRecipes, recipeCrumble],
    });
    await addRecipe([], { duration: "00:00" });
    let recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();

    await addRecipe([], { duration: "-01:00" });
    recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  });

  describe("the adding of ingredient on the recipe form works properly", () => {
    it(`does not validate the recipe if an ingredient with the same name
      was already provided`, async () => {
      const { getAllByText } = await renderCatalog();
      mockedAxios.get.mockResolvedValue({
        data: [...catalogRecipes, recipeCrumble],
      });
      addIngredient(["Fraises", "5", "g"]);
      addIngredient(["Fraises", "5", "g"]);
      await checkRecipeValidationFails();
      const errorMessage = getAllByText(
        "Vous ne pouvez pas ajouter plusieurs fois le même ingrédient"
      );
      expect(errorMessage).toHaveLength(2);
    });

    it(`does not validate the recipe if amount is negative`, async () => {
      const { getByText } = await renderCatalog();
      mockedAxios.get.mockResolvedValue({
        data: [...catalogRecipes, recipeCrumble],
      });
      addIngredient(["Fraises", "-1", "g"]);
      await checkRecipeValidationFails();
      const errorMessage = getByText("La quantité doit être supérieure à 0");
      expect(errorMessage).toBeInTheDocument();
    });

    it(`does not validate the recipe if amount is null`, async () => {
      const { getByText } = await renderCatalog();
      mockedAxios.get.mockResolvedValue({
        data: [...catalogRecipes, recipeCrumble],
      });
      addIngredient(["Fraises", "0", "g"]);
      await checkRecipeValidationFails();
      const errorMessage = getByText("La quantité doit être supérieure à 0");
      expect(errorMessage).toBeInTheDocument();
    });

    it(`does not validate the recipe if the ingredient is not in catalogIngredients`, async () => {
      const { getByText } = await renderCatalog();
      mockedAxios.get.mockResolvedValue({
        data: [...catalogRecipes, recipeCrumble],
      });
      addIngredient(["Poireaux", "50", "g"]);
      await checkRecipeValidationFails();
      const errorMessage = getByText(
        "Cet ingrédient n'existe pas dans le catalogue d'ingrédients. Vous pouvez l'y ajouter"
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it(`provides the right proposals when a letter is entered in the input of the ingredient name`, async () => {
      const { getByLabelText, getAllByTestId } = await renderCatalog();
      const inputIngredientName = getByLabelText("Nom");
      fireEvent.change(inputIngredientName, { target: { value: "f" } });
      const options = getAllByTestId("suggestions");
      const fraises = options[0] as HTMLOptionElement;
      const framboises = options[1] as HTMLOptionElement;
      const farine = options[2] as HTMLOptionElement;
      expect(options).toHaveLength(3);
      expect(fraises.value).toEqual("Fraises");
      expect(framboises.value).toEqual("Framboises");
      expect(farine.value).toEqual("Farine");
    });

    it(`removes ingredient fields on the form when clicking on the
      minus button`, async () => {
      await renderCatalog();
      const plusButton = screen.getByLabelText(
        "Ingredient supplémentaire (plus)"
      );
      fireEvent.click(plusButton);
      checkIngredientFieldsCount(2);
      const minusButton = screen.getByLabelText(
        "Supprimer cet ingredient (moins)"
      );
      fireEvent.click(minusButton);
      checkIngredientFieldsCount(1);
    });

    it(`adds another ingredient fields on the form when clicking
    on plus button`, async () => {
      await renderCatalog();
      const plusButton = screen.getByLabelText(
        "Ingredient supplémentaire (plus)"
      );
      fireEvent.click(plusButton);
      checkIngredientFieldsCount(2);
    });

    it(`displays a plus button only for the last ingredient fields,
     and displays a minus button for the others`, async () => {
      await renderCatalog();
      const ingredientFieldset = screen.getByRole("group", {
        name: "Ingrédients :",
      });
      let buttons = within(ingredientFieldset).getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0].textContent).toBe("+");

      fireEvent.click(buttons[0]);
      buttons = within(ingredientFieldset).getAllByRole("button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0].textContent).toBe("-");
      expect(buttons[1].textContent).toBe("+");

      fireEvent.click(buttons[1]);
      buttons = within(ingredientFieldset).getAllByRole("button");
      expect(buttons).toHaveLength(3);
      expect(buttons[0].textContent).toBe("-");
      expect(buttons[1].textContent).toBe("-");
      expect(buttons[2].textContent).toBe("+");
    });

    function checkIngredientFieldsCount(count: number) {
      const nameFields = screen.getAllByLabelText("Nom");
      const amountFields = screen.getAllByLabelText("Quantité nécessaire");
      expect(nameFields).toHaveLength(count);
      expect(amountFields).toHaveLength(count);
    }

    async function checkRecipeValidationFails() {
      await addRecipe();
      const recipe = screen.queryByText(/Crumble aux poires/);
      expect(recipe).not.toBeInTheDocument();
    }
  });

  async function addRecipe(
    missingFields: string[] = [],
    customFields = { duration: "00:10:00" }
  ) {
    const axiosPostResponse = {
      data: {
        id: "5",
        title: "Crumble aux poires",
        categories: ["Entrée"],
        duration: customFields["duration"],
        ingredients: [
          { ingredient: "Poires", amount: "1", unit: "kg" },
          { ingredient: "Beurre", amount: "30", unit: "g" },
        ],
        description: "Épluchez et épépinez les poires. Coupez-les en dés.",
      },
    };
    mockedAxios.post.mockResolvedValue(axiosPostResponse);
    const inputTitle = screen.getByLabelText("Titre de la recette :");
    const entree = screen.getByLabelText("Entrée");
    const inputDuration = screen.getByLabelText("Temps total de la recette :");
    const inputDescription = screen.getByLabelText("Corps de la recette :");
    const submitButton = screen.getByLabelText("Ajouter la recette");
    if (!missingFields.includes("title")) {
      fireEvent.change(inputTitle, { target: { value: "Crumble aux poires" } });
    }
    if (!missingFields.includes("categories")) {
      fireEvent.click(entree);
    }
    if (!missingFields.includes("duration")) {
      const duration = customFields["duration"] || "00:10";
      fireEvent.change(inputDuration, { target: { value: duration } });
    }
    if (!missingFields.includes("ingredients")) {
      if (missingFields.includes("ingredientName")) {
        addIngredient(["", "1", "kg"]);
        addIngredient(["", "30", "g"]);
      } else if (missingFields.includes("ingredientAmount")) {
        addIngredient(["Poires", "", "kg"]);
        addIngredient(["Beurre", "", "g"]);
      } else if (missingFields.includes("ingredientUnit")) {
        addIngredient(["Poires", "1", ""]);
        addIngredient(["Beurre", "30", ""]);
      } else {
        addIngredient(["Poires", "1", "kg"]);
        addIngredient(["Beurre", "30", "g"]);
      }
    }

    if (!missingFields.includes("description")) {
      fireEvent.change(inputDescription, {
        target: {
          value: "Épluchez et épépinez les poires. Coupez-les en dés.",
        },
      });
    }
    await waitFor(() => {
      fireEvent.click(submitButton);
    });
    if (!missingFields) {
      await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    }
  }

  function addIngredient(value: string[]) {
    const inputIngredientName = screen.getAllByLabelText("Nom");
    const inputAmount = screen.getAllByLabelText("Quantité nécessaire");
    const selectedUnit = screen.getAllByLabelText("Unité");
    fireEvent.change(inputIngredientName[inputIngredientName.length - 1], {
      target: { value: value[0] },
    });
    fireEvent.change(inputAmount[inputAmount.length - 1], {
      target: { value: value[1] },
    });
    fireEvent.change(selectedUnit[selectedUnit.length - 1], {
      target: { value: value[2] },
    });
    const plusButton = screen.getByLabelText(
      "Ingredient supplémentaire (plus)"
    );
    fireEvent.click(plusButton);
  }

  it(`displays an error message and does not add the recipe if the recipe adding
was not successful on backend side`, async () => {
    const { getByLabelText, getByText, queryByText } = await renderCatalog();
    const axiosPostResponse = {};
    mockedAxios.post.mockRejectedValue(axiosPostResponse);
    const inputTitle = getByLabelText("Titre de la recette :");
    const entree = getByLabelText("Entrée");
    const inputDuration = getByLabelText("Temps total de la recette :");
    const inputDescription = getByLabelText("Corps de la recette :");
    const submitButton = getByLabelText("Ajouter la recette");
    fireEvent.change(inputTitle, { target: { value: "Crumble aux poires" } });
    fireEvent.click(entree);
    fireEvent.change(inputDuration, { target: { value: "00:10" } });
    addIngredient(["Poires", "1", "kg"]);
    fireEvent.change(inputDescription, {
      target: {
        value: "Épluchez et épépinez les poires. Coupez-les en dés.",
      },
    });
    await waitFor(() => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    const recipeToAdd = queryByText("Crumble aux poires", { exact: false });
    expect(recipeToAdd).not.toBeInTheDocument();
    const error = getByText(/L'ajout de recette a échoué/);
    expect(error).toBeInTheDocument();
  });
});

describe("the removing recipe functionality works properly", () => {
  it("removes the recipe when clicking on the button", async () => {
    const { getByText, getAllByLabelText } = await renderCatalog();
    const axiosDeleteResponse = { data: "" };
    mockedAxios.delete.mockResolvedValue(axiosDeleteResponse);
    const recipeRemoved = getByText("Marinade de saumon fumé", {
      exact: false,
    });
    const recipe = getByText("Salade de pommes de terre radis", {
      exact: false,
    });
    const button = getAllByLabelText("Supprimer la recette")[1];
    fireEvent.click(button);
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: "1",
          categories: ["Plat"],
          title: "Salade de pommes de terre radis",
          ingredients: [
            { ingredient: "Pommes de terre", amount: "1", unit: "kg" },
            { ingredient: "Oeufs", amount: "3", unit: "pièce(s)" },
            { ingredient: "Vinaigre non balsamique", amount: "1", unit: "cas" },
            { ingredient: "Radis", amount: "2", unit: "botte(s)" },
            { ingredient: "Oignons bottes", amount: "2", unit: "pièce(s)" },
            { ingredient: "Yaourt grec", amount: "1", unit: "pièce(s)" },
            { ingredient: "Mayonnaise", amount: "1", unit: "cas" },
            { ingredient: "Moutarde", amount: "0.5", unit: "cas" },
            { ingredient: "Ail", amount: "1", unit: "gousse(s)" },
          ],
          duration: "35 min",
          description:
            "Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Couper les radis en rondelles. Emincer les échalottes et les oignons. Couper les oeufs durs. Mettre le tout dans un saladier et rajouter le vinaigre. Mélanger. Préparer la sauce :  mélanger le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
        },
      ],
    });
    await waitFor(() => expect(mockedAxios.delete).toHaveBeenCalledTimes(1));
    expect(recipeRemoved).not.toBeInTheDocument();
    expect(recipe).toBeInTheDocument();
  });

  it(`displays an error message and keeps the recipe if the recipe removal
was not successful on backend side`, async () => {
    const { getByText, getAllByLabelText } = await renderCatalog();
    const axiosDeleteResponse = { data: "" };
    mockedAxios.delete.mockRejectedValue(axiosDeleteResponse);
    let recipeToRemoved = getByText("Marinade de saumon fumé", {
      exact: false,
    });
    const recipe = getByText("Salade de pommes de terre radis", {
      exact: false,
    });
    const button = getAllByLabelText("Supprimer la recette")[1];
    fireEvent.click(button);
    await waitFor(() => expect(mockedAxios.delete).toHaveBeenCalledTimes(1));
    recipeToRemoved = getByText("Marinade de saumon fumé", {
      exact: false,
    });
    expect(recipe).toBeInTheDocument();
    expect(recipeToRemoved).toBeInTheDocument();
    const error = getByText(
      /La suppression a échoué. Veuillez réessayer ultérieurement./
    );
    expect(error).toBeInTheDocument();
  });
});

describe("the search bar functionality works properly", () => {
  it(`displays the correct recipes according to their title when a letter
    is entered in the search bar`, async () => {
    const { getByText, queryByText, getByPlaceholderText } =
      await renderCatalog();
    const searchBar = getByPlaceholderText("Recherche par titre...");
    fireEvent.change(searchBar, { target: { value: "M" } });
    expect(getByText("Marinade de saumon fumé")).toBeInTheDocument();
    expect(
      queryByText("Salade de pommes de terre radis")
    ).not.toBeInTheDocument();
    fireEvent.change(searchBar, { target: { value: "Sal" } });
    expect(getByText("Salade de pommes de terre radis")).toBeInTheDocument();
    expect(queryByText("Marinade de saumon fumé")).not.toBeInTheDocument();
  });

  it("redisplays all the recipes of the catalog after a search", async () => {
    const { getByText, queryByText, getByPlaceholderText } =
      await renderCatalog();
    const searchBar = getByPlaceholderText("Recherche par titre...");
    fireEvent.change(searchBar, { target: { value: "sa" } });
    expect(getByText("Salade de pommes de terre radis")).toBeInTheDocument();
    expect(queryByText("Marinade de saumon fumé")).not.toBeInTheDocument();
    fireEvent.change(searchBar, { target: { value: "" } });
    expect(getByText("Salade de pommes de terre radis")).toBeInTheDocument();
    expect(getByText("Marinade de saumon fumé")).toBeInTheDocument();
  });
});

describe("edit functionality", () => {
  it(`transforms the catalog recipe add form to an edit form when
   clicking on an edit button`, async () => {
    const { getByText, queryByText, getByDisplayValue, queryByLabelText } =
      await renderCatalog();
    clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
    expect(
      getByText("Modifier une recette de mon catalogue :")
    ).toBeInTheDocument();
    expect(
      queryByText("Ajouter une recette dans mon catalogue :")
    ).not.toBeInTheDocument();
    expect(getByText("Modifier")).toBeInTheDocument();
    expect(queryByLabelText("Ajouter la recette")).not.toBeInTheDocument();
    const titleRecipe = getByDisplayValue("Salade de pommes de terre radis");
    expect(titleRecipe).toBeInTheDocument();
    expect(titleRecipe).toHaveFocus();
    expect(
      getByDisplayValue(
        /Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs./
      )
    ).toBeInTheDocument();
  });

  it(`keeps the edit mode but changes the form values when clicking on
    another edit button`, async () => {
    const { getByText, getByDisplayValue, queryByDisplayValue } =
      await renderCatalog();
    clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
    expect(
      getByText("Modifier une recette de mon catalogue :")
    ).toBeInTheDocument();
    const recipeTitle1Present = getByDisplayValue(
      "Salade de pommes de terre radis"
    );
    expect(recipeTitle1Present).toBeInTheDocument();
    clickOnEditRecipe(getByText, "Marinade de saumon fumé");
    const recipeTitle2 = getByDisplayValue("Marinade de saumon fumé");
    expect(recipeTitle2).toBeInTheDocument();
    const recipeTitle1Absent = queryByDisplayValue(
      "Salade de pommes de terre radis"
    );
    expect(recipeTitle1Absent).not.toBeInTheDocument();
  });

  it(`transforms the catalog recipes edit form to an add form and reset
  the values when clicking on the cancel button`, async () => {
    const {
      getByText,
      getByDisplayValue,
      queryByLabelText,
      queryByText,
      queryByDisplayValue,
    } = await renderCatalog();
    clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
    expect(
      getByText("Modifier une recette de mon catalogue :")
    ).toBeInTheDocument();
    expect(queryByLabelText("Ajouter la recette")).not.toBeInTheDocument();
    const recipeTitlePresent = getByDisplayValue(
      "Salade de pommes de terre radis"
    );
    expect(recipeTitlePresent).toBeInTheDocument();
    const cancelButton = getByText("Annuler");
    fireEvent.click(cancelButton);
    expect(
      getByText("Ajouter une recette dans mon catalogue :")
    ).toBeInTheDocument();
    expect(queryByText("Modifier")).not.toBeInTheDocument();
    const recipeTitleAbsent = queryByDisplayValue(
      "Salade de pommes de terre radis"
    );
    expect(queryByText("oeufs")).not.toBeInTheDocument();
    expect(recipeTitleAbsent).not.toBeInTheDocument();
  });

  it(`modify the recipe when clicking on the edit button`, async () => {
    const { getByText, getByLabelText, findByText } = await renderCatalog();
    clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
    const modifiedRecipe = {
      id: "1",
      categories: ["Plat", "Entrée"],
      title: "Salade de pommes de terre avec radis",
      ingredients: [
        { ingredient: "Pommes de terre", amount: "1", unit: "kg" },
        { ingredient: "Oeufs", amount: "3", unit: "pièce(s)" },
        { ingredient: "Vinaigre non balsamique", amount: "1", unit: "cas" },
        { ingredient: "Radis", amount: "2", unit: "botte(s)" },
        { ingredient: "Oignons bottes", amount: "2", unit: "pièce(s)" },
        { ingredient: "Yaourt grec", amount: "1", unit: "pièce(s)" },
        { ingredient: "Mayonnaise", amount: "1", unit: "cas" },
        { ingredient: "Moutarde", amount: "0.5", unit: "cas" },
        { ingredient: "Ail", amount: "1", unit: "gousse(s)" },
      ],
      duration: "35 min",
      description: "Description modifiée",
    };
    const axiosGetResponse = {
      data: [modifiedRecipe],
    };
    const axiosPutResponse = {
      data: modifiedRecipe,
    };
    const inputTitle = getByLabelText("Titre de la recette :");
    const inputDescription = getByLabelText("Corps de la recette :");
    fireEvent.change(inputTitle, {
      target: { value: "Salade de pommes de terre avec radis" },
    });
    fireEvent.change(inputDescription, {
      target: { value: "Description modifiée" },
    });
    const editButton = getByText("Modifier");
    mockedAxios.get.mockResolvedValue(axiosGetResponse);
    mockedAxios.put.mockResolvedValue(axiosPutResponse);
    await waitFor(() => {
      fireEvent.click(editButton);
    });
    expect(
      await findByText("Salade de pommes de terre avec radis")
    ).toBeInTheDocument();
    expect(await findByText("Description modifiée")).toBeInTheDocument();
  });

  it(`displays an error message and does not modify the recipe if the
  recipe modification was not successful on backend side`, async () => {
    const { getByText, getByLabelText, findByText } = await renderCatalog();
    clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
    const axiosPutResponse = {};
    mockedAxios.put.mockRejectedValue(axiosPutResponse);
    const inputTitle = getByLabelText("Titre de la recette :");
    const inputDescription = getByLabelText("Corps de la recette :");
    fireEvent.change(inputTitle, {
      target: { value: "Salade de pommes de terre avec radis" },
    });
    fireEvent.change(inputDescription, {
      target: { value: "Description modifiée" },
    });
    const editButton = getByText("Modifier");
    await waitFor(() => {
      fireEvent.click(editButton);
    });
    const errorMessage = "La modification de la recette a échoué.";
    expect(await findByText(errorMessage)).toBeInTheDocument();
    expect(getByText("Salade de pommes de terre radis")).toBeInTheDocument();
    expect(getByText(/Eplucher et couper les patates/)).toBeInTheDocument();
  });

  function clickOnEditRecipe(getByText: GetByType, titleRecipe: string) {
    const recipe = getByText(titleRecipe, { exact: false });
    const divButton = recipe.closest("div");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const button = within(divButton!).getByLabelText("Modifier la recette");
    fireEvent.click(button);
  }
});
