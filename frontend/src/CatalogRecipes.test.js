import React from "react";
import {
  render,
  fireEvent,
  act,
  within,
  waitFor,
} from "@testing-library/react";
import CatalogRecipes from "./CatalogRecipes";
import axios from "axios";

require("mutationobserver-shim");

jest.mock("axios");
let recipes;
let catalogIngredients;
let catalogCategories;
let units;

beforeEach(() => {
  catalogIngredients = [
    {
      name: "Fraises",
    },
    {
      name: "Poires",
    },
    {
      name: "Framboises",
    },
    {
      name: "Beurre",
    },
  ];

  recipes = [
    {
      id: 1,
      categories: ["Plat"],
      title: "Salade de pommes de terre radis",
      ingredients: [
        {
          ingredient: "pommes de terre",
          amount: "1",
          unit: "kg",
        },
        {
          ingredient: "oeufs",
          amount: "3",
          unit: "pièce(s)",
        },
        {
          ingredient: "vinaigre non balsamique",
          amount: "1",
          unit: "cas",
        },
        {
          ingredient: "radis",
          amount: "2",
          unit: "bottes",
        },
        {
          ingredient: "oignons bottes",
          amount: "2",
          unit: "pièce(s)",
        },
        {
          ingredient: "yaourt grec",
          amount: "1",
          unit: "pièce(s)",
        },
        {
          ingredient: "mayonnaise",
          amount: "1",
          unit: "cas",
        },
        {
          ingredient: "moutarde",
          amount: "0.5",
          unit: "cas",
        },
        {
          ingredient: "ail",
          amount: "1",
          unit: "gousse",
        },
      ],
      duration: "00:35:00",
      description:
        "Epluchez et coupez les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Coupez les radis en rondelles. Emincez les échalottes et les oignons. Coupez les oeufs durs. Mettre le tout dans un saladier et rajoutez le vinaigre. Mélangez. Préparez la sauce :  mélangez le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
    },

    {
      id: 2,
      categories: ["Entrée"],
      title: "Marinade de saumon fumé",
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
      duration: "11:00:00",
      description:
        "Emincez le saumon, l'échalotte et le persil. Ajoutez le vinaigre, l'huile, le citron et un peu de poivre. Mélangez et laissez mariner toute la nuit.",
    },
  ];

  catalogCategories = ["Entrée", "Plat", "Dessert", "Gouter"];
  units = ["kg", "g", "cl", "pièce(s)"];
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("initial display is correct", () => {
  it("displays provided categories", () => {
    const { getByText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    const entree = getByText(/Entrée/);
    const gouter = getByText(/Gouter/);
    expect(entree).toBeInTheDocument();
    expect(gouter).toBeInTheDocument();
  });

  it("displays provided units", () => {
    const { getByLabelText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    const unitSelect = getByLabelText("Unité");
    const kg = within(unitSelect).getByText("kg");
    const pieces = within(unitSelect).getByText("pièce(s)");
    expect(kg).toBeInTheDocument();
    expect(pieces).toBeInTheDocument();
  });

  it("displays provided recipes", () => {
    const { getByText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    const salade = getByText(/Salade de pommes de terre radis/);
    const marinade = getByText(/Marinade de saumon fumé/);
    expect(salade).toBeInTheDocument();
    expect(marinade).toBeInTheDocument();
  });
});

describe("the adding recipe functionality works properly", () => {
  it("adds the correct recipe when filling the form and clicking on submit", async () => {
    const { getByLabelText, getByText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    await addRecipe(getByLabelText, getByText);
    const recipe = getByText("Crumble aux poires", { exact: false });
    const poires = getByText(/Poires :/);
    const beurre = getByText(/Beurre :/);
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

  async function checkMissingInput(inputName) {
    const { getByLabelText, getByText, queryByText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    await addRecipe(getByLabelText, getByText, [inputName]);
    const recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  }

  it(`does not add the recipe if no title was provided`, async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    await addRecipe(getByLabelText, getByText, ["title"]);
    const recipe = queryByText("Épluchez et épépinez", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  });

  it(`does not add the recipe if the duration for the recipe is negative or null`, async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    await addRecipe(getByLabelText, getByText, [], { duration: "00:00" });
    let recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();

    await addRecipe(getByLabelText, getByText, [], { duration: "-01:00" });
    recipe = queryByText("Crumble aux poires", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  });

  describe("the adding of ingredient on the recipe form works properly", () => {
    it(`does not add the ingredient if an ingredient with the same name
      was already provided`, () => {
      const { getByLabelText, getByText, getAllByText } = render(
        <CatalogRecipes
          totalRecipes={recipes}
          possibleIngredients={catalogIngredients}
          totalCategories={catalogCategories}
          totalUnits={units}
        />
      );
      addIngredient(getByLabelText, getByText, ["Fraises", "5", "g"]);
      addIngredient(getByLabelText, getByText, ["Fraises", "5", "g"]);
      const ingredient = getAllByText(/Fraises :/);
      expect(ingredient).toHaveLength(1);
    });

    it(`does not add the ingredient if amount is negative or null`, () => {
      const { getByLabelText, getByText, queryByText } = render(
        <CatalogRecipes
          totalRecipes={recipes}
          possibleIngredients={catalogIngredients}
          totalCategories={catalogCategories}
          totalUnits={units}
        />
      );
      addIngredient(getByLabelText, getByText, ["Fraises", "-1", "g"]);
      let fraises = queryByText(/Fraises :/);
      expect(fraises).not.toBeInTheDocument();
      addIngredient(getByLabelText, getByText, ["Fraises", "0", "g"]);
      fraises = queryByText(/Fraises :/);
      expect(fraises).not.toBeInTheDocument();
    });

    it(`does not add the ingredient if the ingredient is not in catalogIngredients`, () => {
      const { getByLabelText, getByText, queryByText } = render(
        <CatalogRecipes
          totalRecipes={recipes}
          possibleIngredients={catalogIngredients}
          totalCategories={catalogCategories}
          totalUnits={units}
        />
      );
      addIngredient(getByLabelText, getByText, ["Poireaux", "50", "g"]);
      const poireaux = queryByText(/Poireaux : /);
      expect(poireaux).not.toBeInTheDocument();
    });

    it(`provides the right proposals when a letter is entered in the input of the ingredient name`, () => {
      const { getByLabelText, getAllByTestId } = render(
        <CatalogRecipes
          totalRecipes={recipes}
          possibleIngredients={catalogIngredients}
          totalCategories={catalogCategories}
          totalUnits={units}
        />
      );
      const inputIngredientName = getByLabelText("Nom :");
      fireEvent.change(inputIngredientName, { target: { value: "f" } });
      const options = getAllByTestId("suggestions");
      let fraises = options[0];
      let framboises = options[1];
      expect(options).toHaveLength(2);
      expect(fraises.value).toEqual("Fraises");
      expect(framboises.value).toEqual("Framboises");
    });

    it(`removes ingredient on the form when clicking on the
      remove button`, async () => {
      const { getByLabelText, getByText } = render(
        <CatalogRecipes
          totalRecipes={recipes}
          possibleIngredients={catalogIngredients}
          totalCategories={catalogCategories}
          totalUnits={units}
        />
      );
      addIngredient(getByLabelText, getByText, ["Poires", "1", "kg"]);
      addIngredient(getByLabelText, getByText, ["Beurre", "30", "g"]);
      const poires = getByText(/Poires : /);
      const beurre = getByText(/Beurre : /);
      const removeButton = within(poires).getByText("X");
      await act(async () => {
        fireEvent.click(removeButton);
      });
      expect(poires).not.toBeInTheDocument();
      expect(beurre).toBeInTheDocument();
    });

    it(`adds ingredients on the form when they are validated`, () => {
      const { getByLabelText, getByText } = render(
        <CatalogRecipes
          totalRecipes={recipes}
          possibleIngredients={catalogIngredients}
          totalCategories={catalogCategories}
          totalUnits={units}
        />
      );
      addIngredient(getByLabelText, getByText, ["Poires", "1", "kg"]);
      addIngredient(getByLabelText, getByText, ["Beurre", "30", "g"]);
      const poires = getByText(/Poires :/);
      const beurre = getByText(/Beurre :/);
      expect(poires).toBeInTheDocument();
      expect(beurre).toBeInTheDocument();
    });
  });

  async function addRecipe(
    getByLabelText,
    getByText,
    missingFields = [],
    customFields = {}
  ) {
    const axiosPostResponse = {
      data: {
        id: 5,
        title: "Crumble aux poires",
        categories: ["Entrée"],
        duration: customFields["duration"] || "00:10:00",
        ingredients: [
          { ingredient: "Poires", amount: "1", unit: "kg" },
          { ingredient: "Beurre", amount: "30", unit: "g" },
        ],
        description: "Épluchez et épépinez les poires. Coupez-les en dés.",
      },
    };
    axios.post.mockResolvedValue(axiosPostResponse);
    const inputTitle = getByLabelText("Titre de la recette :");
    const entree = getByLabelText("Entrée");
    const inputDuration = getByLabelText("Temps total de la recette :");
    const inputDescription = getByLabelText("Corps de la recette :");
    const submitButton = getByText("Confirmer");
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
      addIngredient(getByLabelText, getByText, ["Poires", "1", "kg"]);
      addIngredient(getByLabelText, getByText, ["Beurre", "30", "g"]);
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
      await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    }
  }

  function addIngredient(getByLabelText, getByText, value) {
    const inputIngredientName = getByLabelText("Nom :");
    const inputAmount = getByLabelText("Quantité nécessaire :");
    const selectedUnit = getByLabelText("Unité");
    const addButton = getByText("Ajouter");
    fireEvent.change(inputIngredientName, { target: { value: value[0] } });
    fireEvent.change(inputAmount, { target: { value: value[1] } });
    fireEvent.change(selectedUnit, { target: { value: value[2] } });
    fireEvent.click(addButton);
  }

  it(`displays an error message and does not add the recipe if the recipe adding
was not successful on backend side`, async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    const axiosPostResponse = {};
    axios.post.mockRejectedValue(axiosPostResponse);
    const inputTitle = getByLabelText("Titre de la recette :");
    const entree = getByLabelText("Entrée");
    const inputDuration = getByLabelText("Temps total de la recette :");
    const inputDescription = getByLabelText("Corps de la recette :");
    const submitButton = getByText("Confirmer");
    fireEvent.change(inputTitle, { target: { value: "Crumble aux poires" } });
    fireEvent.click(entree);
    fireEvent.change(inputDuration, { target: { value: "00:10" } });
    addIngredient(getByLabelText, getByText, ["Poires", "1", "kg"]);
    fireEvent.change(inputDescription, {
      target: {
        value: "Épluchez et épépinez les poires. Coupez-les en dés.",
      },
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    const recipeToAdd = queryByText("Crumble aux poires", { exact: false });
    expect(recipeToAdd).not.toBeInTheDocument();
    const error = getByText(/L'ajout de recette a échoué/);
    expect(error).toBeInTheDocument();
  });
});

describe("the removing recipe functionality works properly", () => {
  it("removes the recipe when clicking on the button", async () => {
    const { getByText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    const axiosDeleteResponse = { data: "" };
    axios.delete.mockResolvedValue(axiosDeleteResponse);
    const recipeRemoved = getByText("Marinade de saumon fumé", {
      exact: false,
    });
    const recipe = getByText("Salade de pommes de terre radis", {
      exact: false,
    });
    const button = within(recipeRemoved).getByText("X");
    fireEvent.click(button);
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    expect(recipeRemoved).not.toBeInTheDocument();
    expect(recipe).toBeInTheDocument();
  });

  it(`displays an error message and keeps the recipe if the recipe removal
was not successful on backend side`, async () => {
    const { getByText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    const axiosDeleteResponse = { data: "" };
    axios.delete.mockRejectedValue(axiosDeleteResponse);
    const recipeToRemoved = getByText("Marinade de saumon fumé", {
      exact: false,
    });
    const recipe = getByText("Salade de pommes de terre radis", {
      exact: false,
    });
    const button = within(recipeToRemoved).getByText("X");
    fireEvent.click(button);
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
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
    const { getByText, queryByText, getByPlaceholderText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
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

  it("redisplays all the recipes of the catalog after a search", () => {
    const { getByText, queryByText, getByPlaceholderText } = render(
      <CatalogRecipes
        totalRecipes={recipes}
        possibleIngredients={catalogIngredients}
        totalCategories={catalogCategories}
        totalUnits={units}
      />
    );
    const searchBar = getByPlaceholderText("Recherche par titre...");
    fireEvent.change(searchBar, { target: { value: "sa" } });
    expect(getByText("Salade de pommes de terre radis")).toBeInTheDocument();
    expect(queryByText("Marinade de saumon fumé")).not.toBeInTheDocument();
    fireEvent.change(searchBar, { target: { value: "" } });
    expect(getByText("Salade de pommes de terre radis")).toBeInTheDocument();
    expect(getByText("Marinade de saumon fumé")).toBeInTheDocument();
  });
});
