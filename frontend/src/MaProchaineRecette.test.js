import React from "react";
import { render, fireEvent, within, waitFor } from "@testing-library/react";
import axios from "axios";
import MaProchaineRecette from "./MaProchaineRecette";

require("mutationobserver-shim");

jest.mock("axios");
let recettesCatalogue;
let feasibleRecipes;
let fridgeIngredients;
let catalogIngredients;
let categoriesCatalogue;
let units;
let axiosResponseIngredients;
let axiosResponseRecettes;
let axiosResponseFridgeIngredients;
let axiosResponseCategories;
let axiosResponseUnits;
let axiosResponseRecettesFrigo;
const FETCH_CALLS = 6;

beforeEach(() => {
  recettesCatalogue = [
    {
      id: 1,
      categories: ["Plat"],
      titre: "Salade de pommes de terre radis",
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
      duree: "35 min",
      description:
        "Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Couper les radis en rondelles. Emincer les échalottes et les oignons. Couper les oeufs durs. Mettre le tout dans un saladier et rajouter le vinaigre. Mélanger. Préparer la sauce :  mélanger le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
    },
  ];
  feasibleRecipes = [
    {
      id: 1,
      categories: ["Plat"],
      titre: "Salade de pommes de terre radis",
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
      duree: "35 min",
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
  categoriesCatalogue = ["Entrée", "Plat", "Dessert"];
  units = ["kg", "g", "cl", "pièce(s)"];
  axiosResponseIngredients = { data: catalogIngredients };
  axiosResponseRecettes = { data: recettesCatalogue };
  axiosResponseRecettesFrigo = { data: feasibleRecipes };
  axiosResponseFridgeIngredients = { data: fridgeIngredients };
  axiosResponseCategories = { data: categoriesCatalogue };
  axiosResponseUnits = { data: units };
  mockAxiosGet();
});

function mockAxiosGet(rejectedElement) {
  axios.get.mockImplementation((url) => {
    if (url === "/catalogues/ingredients/") {
      return rejectedElement === "ingredients"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseIngredients);
    } else if (url === "/catalogues/recettes/") {
      return rejectedElement === "recettes"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseRecettes);
    } else if (url === "/frigo/ingredients/") {
      return rejectedElement === "frigo"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseFridgeIngredients);
    } else if (url === "/frigo/recettes/") {
      return rejectedElement === "feasibleRecipes"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseRecettesFrigo);
    } else if (url === "/catalogues/categories/") {
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
    const { getByRole, getByText, queryByText } = render(
      <MaProchaineRecette />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    const prochainesRecettes = getByText("Mes prochaines recettes");
    const frigo = getByText("Voici les ingrédients du frigo !");
    const toutesMesRecettes = queryByText("Catalogue de toutes mes recettes");
    const tousMesIngredients = queryByText("Catalogue de tous mes ingrédients");
    expect(prochainesRecettes).toBeInTheDocument();
    expect(frigo).toBeInTheDocument();
    expect(toutesMesRecettes).not.toBeInTheDocument();
    expect(tousMesIngredients).not.toBeInTheDocument();
  });

  it("renders only ingredients of the catalog when clicking on that nav link", async () => {
    const { getByRole, queryByText, getByText } = render(
      <MaProchaineRecette />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des ingrédients", getByRole);
    const prochainesRecettes = queryByText("Mes prochaines recettes");
    const frigo = queryByText("Voici les ingrédients du frigo !");
    const toutesMesRecettes = queryByText("Catalogue de toutes mes recettes");
    const tousMesIngredients = getByText("Catalogue de tous mes ingrédients");
    expect(prochainesRecettes).not.toBeInTheDocument();
    expect(frigo).not.toBeInTheDocument();
    expect(toutesMesRecettes).not.toBeInTheDocument();
    expect(tousMesIngredients).toBeInTheDocument();
  });

  it("renders only recipes of the catalog when clicking on that nav link", async () => {
    const { getByRole, queryByText, getByText } = render(
      <MaProchaineRecette />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des recettes", getByRole);
    const prochainesRecettes = queryByText("Mes prochaines recettes");
    const frigo = queryByText("Voici les ingrédients du frigo !");
    const toutesMesRecettes = getByText("Catalogue de toutes mes recettes");
    const tousMesIngredients = queryByText("Catalogue de tous mes ingrédients");
    expect(prochainesRecettes).not.toBeInTheDocument();
    expect(frigo).not.toBeInTheDocument();
    expect(toutesMesRecettes).toBeInTheDocument();
    expect(tousMesIngredients).not.toBeInTheDocument();
  });
});

describe("fetches correctly", () => {
  it("fetches and displays ingredients of the fridge when clicking on that nav link", async () => {
    const { getByText, getByRole } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    const epinard = getByText(/épinard/);
    expect(epinard).toBeInTheDocument();
  });

  it("fetches and displays ingredients of the catalog when clicking on that nav link", async () => {
    const { getByRole, getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des ingrédients", getByRole);
    const fraises = getByText("Fraises");
    expect(fraises).toBeInTheDocument();
  });

  it("fetches and displays recipes of the catalog when clicking on that nav link", async () => {
    const { getByRole, getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des recettes", getByRole);
    const salade = getByText("Salade de pommes de terre radis");
    expect(salade).toBeInTheDocument();
  });

  it(`fetches and displays categories of the catalog when clicking on catalog recipes 
  nav link`, async () => {
    const { getByRole, getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des recettes", getByRole);
    const entree = getByText("Entrée");
    expect(entree).toBeInTheDocument();
  });

  it(`fetches and displays units when clicking on catalog recipes 
  nav link`, async () => {
    const { getByRole, getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Catalogue des recettes", getByRole);
    const kg = getByText("kg");
    const pieces = getByText("pièce(s)");
    expect(kg).toBeInTheDocument();
    expect(pieces).toBeInTheDocument();
  });

  it(`fetches and displays units when clicking on my next recipes
  nav link`, async () => {
    const { getByRole, getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    const kg = getByText("kg");
    const pieces = getByText("pièce(s)");
    expect(kg).toBeInTheDocument();
    expect(pieces).toBeInTheDocument();
  });

  it(`fetches and displays feasible recipes when clicking on my next recipes
  nav link`, async () => {
    const { getByRole, getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    navigateTo("Ma prochaine recette", getByRole);
    const titre = getByText("Salade de pommes de terre radis");
    expect(titre).toBeInTheDocument();
  });
});

describe("displays correct error message on bad fetch", () => {
  it("displays an error message if the ingredient fetch was not successful", async () => {
    mockAxiosGet("ingredients");
    const { getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the reciepe fetch was not successful", async () => {
    mockAxiosGet("recettes");
    const { getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the fridge ingredient fetch was not successful", async () => {
    mockAxiosGet("frigo");
    const { getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the categories fetch was not successful", async () => {
    mockAxiosGet("categories");
    const { getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the units fetch was not successful", async () => {
    mockAxiosGet("units");
    const { getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the feasible recipes fetch was not successful", async () => {
    mockAxiosGet("feasibleRecipes");
    const { getByText } = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });
});

describe("Handle correctly new ingredientCatalogue", () => {
  it(`takes into account newly entered ingredient in catalogIngredients by giving suggestions when an ingredient name is being entered in FridgeIngredients`, async () => {
    const maProchaineRecette = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    await addIngredientCatalogue(maProchaineRecette, "Navets");
    const { getByLabelText, getByTestId, getByRole } = maProchaineRecette;
    navigateTo("Ma prochaine recette", getByRole);
    const inputNomFrigo = getByLabelText("Nom de l'ingrédient :");
    fireEvent.change(inputNomFrigo, { target: { value: "Nav" } });
    const navets = getByTestId("suggestions");
    expect(navets.value).toEqual("Navets");
  });

  it(`takes into account newly entered ingredient in catalogIngredients by giving suggestions when an ingredient name is being entered in RecettesCatalogue`, async () => {
    const maProchaineRecette = render(<MaProchaineRecette />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(FETCH_CALLS));
    await addIngredientCatalogue(maProchaineRecette, "Coriandre");
    const { getByLabelText, getByTestId, getByRole } = maProchaineRecette;
    navigateTo("Catalogue des recettes", getByRole);
    const inputNomRecettesCatalogue = getByLabelText("Nom :");
    fireEvent.change(inputNomRecettesCatalogue, { target: { value: "Cor" } });
    const coriandre = getByTestId("suggestions");
    expect(coriandre.value).toEqual("Coriandre");
  });

  async function addIngredientCatalogue(maProchaineRecette, name) {
    const axiosPostResponse = { data: { name: name } };
    axios.post.mockResolvedValue(axiosPostResponse);
    const { getByLabelText, getByText, getByRole } = maProchaineRecette;
    navigateTo("Catalogue des ingrédients", getByRole);
    const inputNomCatalogue = getByLabelText("Nom de l'ingrédient à ajouter :");
    const submitButtonCatalogue = getByText("Envoyer");
    fireEvent.change(inputNomCatalogue, { target: { value: name } });
    fireEvent.click(submitButtonCatalogue);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  }
});
