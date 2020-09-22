import React from "react";
import { render, fireEvent, within, waitFor } from "@testing-library/react";
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
      ingredient: "épinard",
      expiration_date: "2020-04-15",
      amount: "60",
      unit: "g",
    },
  ];
  catalogIngredients = [
    {
      name: "Fraises",
    },
    {
      name: "Sucre",
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
    if (url === "/catalogs/ingredients/") {
      return rejectedElement === "ingredients"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseIngredients);
    } else if (url === "/catalogs/recipes/") {
      return rejectedElement === "recipes"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseRecipes);
    } else if (url === "/fridge/ingredients/") {
      return rejectedElement === "fridge"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseFridgeIngredients);
    } else if (url === "/fridge/recipes/") {
      return rejectedElement === "feasibleRecipes"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseFridgeRecipes);
    } else if (url === "/catalogs/categories/") {
      return rejectedElement === "categories"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseCategories);
    } else if (url === "/units/") {
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
  it(`renders only feasible recipes and fridge ingredients when clicking on that
  nav link`, async () => {
    const { getByRole, getByText, queryByText } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    const nextRecipes = getByText("Mes prochaines recipes");
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
    const nextRecipes = queryByText("Mes prochaines recipes");
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
    const nextRecipes = queryByText("Mes prochaines recipes");
    const fridge = queryByText("Voici les ingrédients du frigo !");
    const allMyRecipes = getByText("Catalogue de toutes mes recettes");
    const allMyIngredients = queryByText("Catalogue de tous mes ingrédients");
    expect(nextRecipes).not.toBeInTheDocument();
    expect(fridge).not.toBeInTheDocument();
    expect(allMyRecipes).toBeInTheDocument();
    expect(allMyIngredients).not.toBeInTheDocument();
  });
});

describe("fetches correctly", () => {
  it("fetches and displays ingredients of the fridge when clicking on that nav link", async () => {
    const { getByText, getByRole } = render(<MyNextRecipe />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    const epinard = getByText(/épinard/);
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

describe("Handle correctly new catalogIngredient", () => {
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
