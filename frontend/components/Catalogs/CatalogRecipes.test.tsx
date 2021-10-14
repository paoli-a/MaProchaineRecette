/* eslint-disable testing-library/no-await-sync-query */
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";
import { SWRConfig } from "swr";
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
  let app;
  await act(async () => {
    app = render(
      <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
        <CatalogRecipes />
      </SWRConfig>
    );
  });
  return app;
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
    const { getByLabelText, getByText, getByTestId } = await renderCatalog();
    mockedAxios.get.mockResolvedValue({
      data: [...catalogRecipes, recipeCrumble],
    });
    await addRecipe(getByLabelText, getByText);
    const recipe = getByText("Crumble aux poires", { exact: false });
    const poires = getByTestId("strong-tag");
    const beurre = getByText(/beurre :/);
    expect(recipe).toBeInTheDocument();
    expect(poires).toBeInTheDocument();
    expect(beurre).toBeInTheDocument();
  });

  it(`does not add the recipe if no ingredient was provided`, async () => {
    await checkMissingInput("ingredients");
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
    const { getByLabelText, getByText, queryByText } = await renderCatalog();
    await addRecipe(getByLabelText, getByText, [inputName]);
    const recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  }

  it(`does not add the recipe if no title was provided`, async () => {
    const { getByLabelText, getByText, queryByText } = await renderCatalog();
    await addRecipe(getByLabelText, getByText, ["title"]);
    const recipe = queryByText("Épluchez et épépinez", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  });

  it(`does not add the recipe if the duration for the recipe is negative or null`, async () => {
    const { getByLabelText, getByText, queryByText } = await renderCatalog();
    await addRecipe(getByLabelText, getByText, [], { duration: "00:00" });
    let recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();

    await addRecipe(getByLabelText, getByText, [], { duration: "-01:00" });
    recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  });

  describe("the adding of ingredient on the recipe form works properly", () => {
    it(`does not add the ingredient if an ingredient with the same name
      was already provided`, async () => {
      const { getByLabelText, getAllByText } = await renderCatalog();
      addIngredient(getByLabelText, ["Fraises", "5", "g"]);
      addIngredient(getByLabelText, ["Fraises", "5", "g"]);
      const ingredient = getAllByText(/Fraises :/);
      expect(ingredient).toHaveLength(1);
    });

    it(`does not add the ingredient if amount is negative or null`, async () => {
      const { getByLabelText, queryByText } = await renderCatalog();
      addIngredient(getByLabelText, ["Fraises", "-1", "g"]);
      let fraises = queryByText(/Fraises :/);
      expect(fraises).not.toBeInTheDocument();
      addIngredient(getByLabelText, ["Fraises", "0", "g"]);
      fraises = queryByText(/Fraises :/);
      expect(fraises).not.toBeInTheDocument();
    });

    it(`does not add the ingredient if the ingredient is not in catalogIngredients`, async () => {
      const { getByLabelText, queryByText } = await renderCatalog();
      addIngredient(getByLabelText, ["Poireaux", "50", "g"]);
      const poireaux = queryByText(/Poireaux : /);
      expect(poireaux).not.toBeInTheDocument();
    });

    it(`provides the right proposals when a letter is entered in the input of the ingredient name`, async () => {
      const { getByLabelText, getAllByTestId } = await renderCatalog();
      const inputIngredientName = getByLabelText("Nom :");
      fireEvent.change(inputIngredientName, { target: { value: "f" } });
      const options = getAllByTestId("suggestions");
      let fraises = options[0] as HTMLOptionElement;
      let framboises = options[1] as HTMLOptionElement;
      expect(options).toHaveLength(2);
      expect(fraises.value).toEqual("Fraises");
      expect(framboises.value).toEqual("Framboises");
    });

    it(`removes ingredient on the form when clicking on the
      remove button`, async () => {
      const { getByLabelText, getByText } = await renderCatalog();
      addIngredient(getByLabelText, ["Poires", "1", "kg"]);
      addIngredient(getByLabelText, ["Beurre", "30", "g"]);
      const poires = getByText(/Poires : /);
      const beurre = getByText(/Beurre : /);
      const removeButton = within(poires).getByText("X");
      await act(async () => {
        fireEvent.click(removeButton);
      });
      expect(poires).not.toBeInTheDocument();
      expect(beurre).toBeInTheDocument();
    });

    it(`adds ingredients on the form when they are validated`, async () => {
      const { getByLabelText, getByText } = await renderCatalog();
      addIngredient(getByLabelText, ["Poires", "1", "kg"]);
      addIngredient(getByLabelText, ["Beurre", "30", "g"]);
      const poires = getByText(/Poires :/);
      const beurre = getByText(/Beurre :/);
      expect(poires).toBeInTheDocument();
      expect(beurre).toBeInTheDocument();
    });
  });

  async function addRecipe(
    getByLabelText: any,
    getByText: any,
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
    const inputTitle = getByLabelText("Titre de la recette :");
    const entree = getByLabelText("Entrée");
    const inputDuration = getByLabelText("Temps total de la recette :");
    const inputDescription = getByLabelText("Corps de la recette :");
    const submitButton = getByLabelText("Ajouter la recette");
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
      addIngredient(getByLabelText, ["Poires", "1", "kg"]);
      addIngredient(getByLabelText, ["Beurre", "30", "g"]);
    }
    if (!missingFields.includes("description")) {
      fireEvent.change(inputDescription, {
        target: {
          value: "Épluchez et épépinez les poires. Coupez-les en dés.",
        },
      });
    }
    await act(async () => {
      fireEvent.click(submitButton);
    });
    if (!missingFields) {
      await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    }
  }

  function addIngredient(getByLabelText: any, value: string[]) {
    const inputIngredientName = getByLabelText("Nom :");
    const inputAmount = getByLabelText("Quantité nécessaire :");
    const selectedUnit = getByLabelText("Unité");
    const addButton = getByLabelText("Ajouter l'ingrédient");
    fireEvent.change(inputIngredientName, { target: { value: value[0] } });
    fireEvent.change(inputAmount, { target: { value: value[1] } });
    fireEvent.change(selectedUnit, { target: { value: value[2] } });
    fireEvent.click(addButton);
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
    addIngredient(getByLabelText, ["Poires", "1", "kg"]);
    fireEvent.change(inputDescription, {
      target: {
        value: "Épluchez et épépinez les poires. Coupez-les en dés.",
      },
    });
    await act(async () => {
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
            { ingredient: "pommes de terre", amount: "1", unit: "kg" },
            { ingredient: "oeufs", amount: "3", unit: "pièce(s)" },
            { ingredient: "vinaigre non balsamique", amount: "1", unit: "cas" },
            { ingredient: "radis", amount: "2", unit: "botte(s)" },
            { ingredient: "oignons bottes", amount: "2", unit: "pièce(s)" },
            { ingredient: "yaourt grec", amount: "1", unit: "pièce(s)" },
            { ingredient: "mayonnaise", amount: "1", unit: "cas" },
            { ingredient: "moutarde", amount: "0.5", unit: "cas" },
            { ingredient: "ail", amount: "1", unit: "gousse(s)" },
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
    const {
      getByText,
      queryByText,
      getByPlaceholderText,
    } = await renderCatalog();
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
    const {
      getByText,
      queryByText,
      getByPlaceholderText,
    } = await renderCatalog();
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
    const {
      getByText,
      queryByText,
      getByDisplayValue,
      queryByLabelText,
    } = await renderCatalog();
    await clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
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
    const {
      getByText,
      getByDisplayValue,
      queryByDisplayValue,
    } = await renderCatalog();
    await clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
    expect(
      getByText("Modifier une recette de mon catalogue :")
    ).toBeInTheDocument();
    let recipeTitle1 = getByDisplayValue("Salade de pommes de terre radis");
    expect(recipeTitle1).toBeInTheDocument();
    await clickOnEditRecipe(getByText, "Marinade de saumon fumé");
    const recipeTitle2 = getByDisplayValue("Marinade de saumon fumé");
    expect(recipeTitle2).toBeInTheDocument();
    recipeTitle1 = queryByDisplayValue("Salade de pommes de terre radis");
    expect(recipeTitle1).not.toBeInTheDocument();
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
    await clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
    expect(
      getByText("Modifier une recette de mon catalogue :")
    ).toBeInTheDocument();
    expect(queryByLabelText("Ajouter la recette")).not.toBeInTheDocument();
    let recipeTitle = getByDisplayValue("Salade de pommes de terre radis");
    expect(recipeTitle).toBeInTheDocument();
    const cancelButton = getByText("Annuler");
    fireEvent.click(cancelButton);
    expect(
      getByText("Ajouter une recette dans mon catalogue :")
    ).toBeInTheDocument();
    expect(queryByText("Modifier")).not.toBeInTheDocument();
    recipeTitle = queryByDisplayValue("Salade de pommes de terre radis");
    expect(queryByText("oeufs")).not.toBeInTheDocument();
    expect(recipeTitle).not.toBeInTheDocument();
  });

  it(`modify the recipe when clicking on the edit button`, async () => {
    const { getByText, getByLabelText, findByText } = await renderCatalog();
    await clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
    const axiosGetResponse = {
      data: [
        {
          id: "1",
          categories: ["Plat", "Entrée"],
          title: "Salade de pommes de terre avec radis",
          ingredients: [
            { ingredient: "pommes de terre", amount: "1", unit: "kg" },
            { ingredient: "oeufs", amount: "3", unit: "pièce(s)" },
            { ingredient: "vinaigre non balsamique", amount: "1", unit: "cas" },
            { ingredient: "radis", amount: "2", unit: "botte(s)" },
            { ingredient: "oignons bottes", amount: "2", unit: "pièce(s)" },
            { ingredient: "yaourt grec", amount: "1", unit: "pièce(s)" },
            { ingredient: "mayonnaise", amount: "1", unit: "cas" },
            { ingredient: "moutarde", amount: "0.5", unit: "cas" },
            { ingredient: "ail", amount: "1", unit: "gousse(s)" },
          ],
          duration: "35 min",
          description: "Description modifiée",
          priority_ingredients: ["oeufs"],
          unsure_ingredients: ["ail"],
        },
      ],
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
    mockedAxios.put.mockResolvedValue(axiosGetResponse);
    await act(async () => {
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
    await clickOnEditRecipe(getByText, "Salade de pommes de terre radis");
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
    await act(async () => {
      fireEvent.click(editButton);
    });
    const errorMessage = "La modification de la recette a échoué.";
    expect(await findByText(errorMessage)).toBeInTheDocument();
    expect(getByText("Salade de pommes de terre radis")).toBeInTheDocument();
    expect(getByText(/Eplucher et couper les patates/)).toBeInTheDocument();
  });

  async function clickOnEditRecipe(getByText: any, titleRecipe: string) {
    const recipe = getByText(titleRecipe, { exact: false });
    const divButton = recipe.closest("div");
    const button = within(divButton).getByAltText("Modifier");
    fireEvent.click(button);
  }
});
