/* eslint-disable testing-library/no-await-sync-query */
import React from "react";
import {
  act,
  render,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import axios from "axios";
import MyNextRecipe from "./MyNextRecipe";

require("mutationobserver-shim");

jest.mock("axios");
let catalogRecipes;
let feasibleRecipes;
let fridgeIngredients;
let catalogIngredients;
let catalogCategories;
let units;
let axiosResponseIngredients;
let axiosResponseRecipes;
let axiosResponseFridgeIngredients;
let axiosResponseCategories;
let axiosResponseUnits;
let axiosResponseFridgeRecipes;
const FETCH_CALLS = 6;

beforeEach(() => {
  catalogRecipes = [
    {
      id: 1,
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
  ];
  feasibleRecipes = [
    {
      id: 1,
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
      priority_ingredients: ["oeufs"],
      unsure_ingredients: ["ail"],
    },
  ];
  fridgeIngredients = [
    {
      id: 1,
      ingredient: "Epinards",
      expiration_date: "2050-04-15",
      amount: "60",
      unit: "g",
    },
    {
      id: 2,
      ingredient: "Pommes de terre",
      expiration_date: "2050-04-15",
      amount: "1",
      unit: "kg",
    },
  ];
  catalogIngredients = [
    {
      name: "Fraises",
    },
    {
      name: "Sucre",
    },
    {
      name: "Epinards",
    },
    {
      name: "Kiwi",
    },
  ];
  catalogCategories = ["Entrée", "Plat", "Dessert"];
  units = ["kg", "g", "cl", "pièce(s)"];
  axiosResponseIngredients = { data: catalogIngredients };
  axiosResponseRecipes = { data: catalogRecipes };
  axiosResponseFridgeRecipes = { data: feasibleRecipes };
  axiosResponseFridgeIngredients = { data: fridgeIngredients };
  axiosResponseCategories = { data: catalogCategories };
  axiosResponseUnits = { data: units };
  mockAxiosGet();
});

function mockAxiosGet(rejectedElement) {
  axios.get.mockImplementation((url) => {
    if (url === "/api/catalogs/ingredients/") {
      return rejectedElement === "ingredients"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseIngredients);
    } else if (url === "/api/catalogs/recipes/") {
      return rejectedElement === "recipes"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseRecipes);
    } else if (url === "/api/fridge/ingredients/") {
      return rejectedElement === "fridge"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseFridgeIngredients);
    } else if (url === "/api/fridge/recipes/") {
      return rejectedElement === "feasibleRecipes"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseFridgeRecipes);
    } else if (url === "/api/catalogs/categories/") {
      return rejectedElement === "categories"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseCategories);
    } else if (url === "/api/units/units/") {
      return rejectedElement === "units"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseUnits);
    } else {
      return Promise.reject(new Error(`L'URL '${url}' n'est pas supportée.`));
    }
  });
}

afterEach(() => {
  jest.clearAllMocks();
});

const navigateTo = (linkText, getByRole) => {
  const nav = getByRole("navigation");
  const navElement = within(nav).getByText(linkText);
  fireEvent.click(navElement);
};

describe("renders correctly", () => {
  describe("renders correctly pages", () => {
    it(`renders only feasible recipes and fridge ingredients when clicking on that
  nav link`, async () => {
      const { getByRole, getByText, queryByText } = render(<MyNextRecipe />);
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
      navigateTo("Ma prochaine recette", getByRole);
      const nextRecipes = getByText("Mes prochaines recettes");
      const fridge = getByText("Voici les ingrédients du frigo !");
      const allMyRecipes = queryByText("Catalogue de toutes mes recettes");
      const allMyIngredients = queryByText("Catalogue de tous mes ingrédients");
      expect(nextRecipes).toBeInTheDocument();
      expect(fridge).toBeInTheDocument();
      expect(allMyRecipes).not.toBeInTheDocument();
      expect(allMyIngredients).not.toBeInTheDocument();
    });

    it("renders only ingredients of the catalog when clicking on that nav link", async () => {
      const { getByRole, queryByText, getByText } = render(<MyNextRecipe />);
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
      navigateTo("Catalogue des ingrédients", getByRole);
      const nextRecipes = queryByText("Mes prochaines recettes");
      const fridge = queryByText("Voici les ingrédients du frigo !");
      const allMyRecipes = queryByText("Catalogue de toutes mes recettes");
      const allMyIngredients = getByText("Catalogue de tous mes ingrédients");
      expect(nextRecipes).not.toBeInTheDocument();
      expect(fridge).not.toBeInTheDocument();
      expect(allMyRecipes).not.toBeInTheDocument();
      expect(allMyIngredients).toBeInTheDocument();
    });

    it("renders only recipes of the catalog when clicking on that nav link", async () => {
      const { getByRole, queryByText, getByText } = render(<MyNextRecipe />);
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
      navigateTo("Catalogue des recettes", getByRole);
      const nextRecipes = queryByText("Mes prochaines recettes");
      const fridge = queryByText("Voici les ingrédients du frigo !");
      const allMyRecipes = getByText("Catalogue de toutes mes recettes");
      const allMyIngredients = queryByText("Catalogue de tous mes ingrédients");
      expect(nextRecipes).not.toBeInTheDocument();
      expect(fridge).not.toBeInTheDocument();
      expect(allMyRecipes).toBeInTheDocument();
      expect(allMyIngredients).not.toBeInTheDocument();
    });
  });

  describe("renders correctly document title", () => {
    it(`renders correct title when click on my next recipe page`, async () => {
      const { getByRole } = render(<MyNextRecipe />);
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
      navigateTo("Ma prochaine recette", getByRole);
      await waitFor(() =>
        expect(document.title).toEqual("Ma prochaine recette")
      );
    });

    it(`renders correct title when click on ingredients catalog page`, async () => {
      const { getByRole } = render(<MyNextRecipe />);
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
      navigateTo("Catalogue des ingrédients", getByRole);
      await waitFor(() =>
        expect(document.title).toEqual("Catalogue des ingrédients")
      );
    });

    it(`renders correct title when click on recipes catalog page`, async () => {
      const { getByRole } = render(<MyNextRecipe />);
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
      navigateTo("Catalogue des recettes", getByRole);
      await waitFor(() =>
        expect(document.title).toEqual("Catalogue des recettes")
      );
    });
  });
});

describe("fetches correctly", () => {
  it("fetches and displays ingredients of the fridge when clicking on that nav link", async () => {
    const { getByText, getByRole } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    const epinard = getByText(/Epinards/);
    expect(epinard).toBeInTheDocument();
  });

  it("fetches and displays ingredients of the catalog when clicking on that nav link", async () => {
    const { getByRole, getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des ingrédients", getByRole);
    const fraises = getByText("Fraises");
    expect(fraises).toBeInTheDocument();
  });

  it("fetches and displays recipes of the catalog when clicking on that nav link", async () => {
    const { getByRole, getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des recettes", getByRole);
    const salade = getByText("Salade de pommes de terre radis");
    expect(salade).toBeInTheDocument();
  });

  it(`fetches and displays categories of the catalog when clicking on catalog recipes
  nav link`, async () => {
    const { getByRole, getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des recettes", getByRole);
    const entree = getByText("Entrée");
    expect(entree).toBeInTheDocument();
  });

  it(`fetches and displays units when clicking on catalog recipes
  nav link`, async () => {
    const { getByRole, getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des recettes", getByRole);
    const kg = getByText("kg");
    const pieces = getByText("pièce(s)");
    expect(kg).toBeInTheDocument();
    expect(pieces).toBeInTheDocument();
  });

  it(`fetches and displays units when clicking on my next recipes
  nav link`, async () => {
    const { getByRole, getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    const kg = getByText("kg");
    const pieces = getByText("pièce(s)");
    expect(kg).toBeInTheDocument();
    expect(pieces).toBeInTheDocument();
  });

  it(`fetches and displays feasible recipes when clicking on my next recipes
  nav link`, async () => {
    const { getByRole, getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    const title = getByText("Salade de pommes de terre radis");
    expect(title).toBeInTheDocument();
  });
});

describe("displays correct error message on bad fetch", () => {
  it("displays an error message if the ingredient fetch was not successful", async () => {
    mockAxiosGet("ingredients");
    const { getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the reciepe fetch was not successful", async () => {
    mockAxiosGet("recipes");
    const { getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the fridge ingredient fetch was not successful", async () => {
    mockAxiosGet("fridge");
    const { getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the categories fetch was not successful", async () => {
    mockAxiosGet("categories");
    const { getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the units fetch was not successful", async () => {
    mockAxiosGet("units");
    const { getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the feasible recipes fetch was not successful", async () => {
    mockAxiosGet("feasibleRecipes");
    const { getByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });
});

describe("Handle correctly new catalog ingredient", () => {
  it(`takes into account newly entered ingredient in catalogIngredients by giving suggestions when an ingredient name is being entered in FridgeIngredients`, async () => {
    const myNextRecipe = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    await addCatalogIngredient(myNextRecipe, "Navets");
    const { getByLabelText, getByTestId, getByRole } = myNextRecipe;
    navigateTo("Ma prochaine recette", getByRole);
    const inputNameFridge = getByLabelText("Nom de l'ingrédient :");
    fireEvent.change(inputNameFridge, { target: { value: "Nav" } });
    const navets = getByTestId("suggestions");
    expect(navets.value).toEqual("Navets");
  });

  it(`takes into account newly entered ingredient in catalogIngredients by giving suggestions when an ingredient name is being entered in CatalogRecipes`, async () => {
    const myNextRecipe = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    await addCatalogIngredient(myNextRecipe, "Coriandre");
    const { getByLabelText, getByTestId, getByRole } = myNextRecipe;
    navigateTo("Catalogue des recettes", getByRole);
    const inputCatalogRecipesName = getByLabelText("Nom :");
    fireEvent.change(inputCatalogRecipesName, { target: { value: "Cor" } });
    const coriandre = getByTestId("suggestions");
    expect(coriandre.value).toEqual("Coriandre");
  });

  async function addCatalogIngredient(myNextRecipe, name) {
    const axiosPostResponse = { data: { name: name } };
    axios.post.mockResolvedValue(axiosPostResponse);
    const { getByLabelText, getByText, getByRole } = myNextRecipe;
    navigateTo("Catalogue des ingrédients", getByRole);
    const inputCatalogName = getByLabelText("Nom de l'ingrédient à ajouter :");
    const submitButtonCatalog = getByText("Envoyer");
    fireEvent.change(inputCatalogName, { target: { value: name } });
    fireEvent.click(submitButtonCatalog);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  }
});

describe("Handle correctly new catalog recipes", () => {
  it("refetches feasible recipes when a new catalog recipe is added", async () => {
    const { getByLabelText, queryByText, getByText, getByRole } = render(
      <MyNextRecipe />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    let recipeToAdd = queryByText("Plats d'épinards", { exact: false });
    expect(recipeToAdd).not.toBeInTheDocument();
    await addRecipe(getByLabelText, getByRole, getByText);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    navigateTo("Ma prochaine recette", getByRole);
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS + 1)
    );
    recipeToAdd = getByText("Plat d'épinards", { exact: false });
    expect(recipeToAdd).toBeInTheDocument();
  });

  it(`rerenders and displays all the catalog recipes even the newly entered when we navigate between tabs`, async () => {
    const { getByRole, getByText, getByLabelText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    await addRecipe(getByLabelText, getByRole, getByText);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    navigateTo("Ma prochaine recette", getByRole);
    navigateTo("Catalogue des recettes", getByRole);
    const newRecipe = getByText("Plat d'épinards", { exact: false });
    expect(newRecipe).toBeInTheDocument();
  });

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

  async function addRecipe(getByLabelText, getByRole, getByText) {
    navigateTo("Catalogue des recettes", getByRole);
    const axiosPostResponse = {
      data: {
        id: 6,
        title: "Plat d'épinards",
        categories: ["Plat"],
        duration: "00:10:00",
        ingredients: [{ ingredient: "Epinards", amount: "50", unit: "g" }],
        description: "Coupez les épinards et cuisez-les dans de l'eau.",
      },
    };
    axios.post.mockResolvedValue(axiosPostResponse);
    const inputTitle = getByLabelText("Titre de la recette :");
    const plat = getByLabelText("Plat");
    const inputDuration = getByLabelText("Temps total de la recette :");
    const inputDescription = getByLabelText("Corps de la recette :");
    const submitButton = getByText("Confirmer");
    fireEvent.change(inputTitle, { target: { value: "Plat d'épinards" } });
    fireEvent.click(plat);
    fireEvent.change(inputDuration, { target: { value: "00:10" } });
    addIngredient(getByLabelText, getByText, ["Epinards", "50", "g"]);
    fireEvent.change(inputDescription, {
      target: {
        value: "Coupez les épinards et cuisez-les dans de l'eau.",
      },
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    axiosResponseFridgeRecipes = axiosResponseFridgeRecipes.data.push(
      axiosPostResponse.data
    );
    axios.get.mockResolvedValue(axiosResponseFridgeRecipes);
  }
});

describe("Handle correctly new fridge ingredients", () => {
  it("refetches feasible recipes when a fridge ingredient is removed", async () => {
    const { queryByText, getByText, getByRole } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    let recipe = getByText("Salade de pommes de terre", { exact: false });
    expect(recipe).toBeInTheDocument();
    axios.get.mockResolvedValue({ data: [] });
    await deleteFridgeIngredient(getByText);
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS + 1)
    );
    recipe = queryByText("Salade de pommes de terre", { exact: false });
    expect(recipe).not.toBeInTheDocument();
  });

  it(`rerenders and displays all the fridge ingredients even the newly entered when we navigate between tabs`, async () => {
    const { getByRole, getByText, getByLabelText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    await addFridgeIngredient(getByLabelText, getByText);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    navigateTo("Catalogue des recettes", getByRole);
    navigateTo("Ma prochaine recette", getByRole);
    const newIngredient = getByText("Kiwi", { exact: false });
    expect(newIngredient).toBeInTheDocument();
  });

  async function addFridgeIngredient(getByLabelText, getByText) {
    const axiosPostResponse = {
      data: {
        id: 4,
        ingredient: "Kiwi",
        expiration_date: "2100-04-03",
        amount: "1",
        unit: "g",
      },
    };
    axios.post.mockResolvedValue(axiosPostResponse);
    const inputName = getByLabelText("Nom de l'ingrédient :");
    const inputAmount = getByLabelText("Quantité :");
    const inputDate = getByLabelText("Date de péremption :");
    const selectedUnit = getByLabelText("Unité");
    const submitButton = getByText("Confirmer");
    fireEvent.change(inputName, { target: { value: "Kiwi" } });
    fireEvent.change(inputAmount, { target: { value: "1" } });
    fireEvent.change(inputDate, { target: { value: "2100-04-03" } });
    fireEvent.change(selectedUnit, { target: { value: "g" } });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    axiosResponseFridgeIngredients = axiosResponseFridgeIngredients.data.push(
      axiosPostResponse.data
    );
    axios.get.mockResolvedValue(axiosResponseFridgeIngredients);
  }

  async function deleteFridgeIngredient(getByText) {
    const axiosDeleteResponse = { data: "" };
    axios.delete.mockResolvedValue(axiosDeleteResponse);
    const ingredient = getByText(/Pommes de terre/);
    const button = within(ingredient).getByText("Supprimer");
    fireEvent.click(button);
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
  }
});
