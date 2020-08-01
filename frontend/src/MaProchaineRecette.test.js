import React from "react";
import { render, fireEvent, within, waitFor } from "@testing-library/react";
import axios from "axios";
import MaProchaineRecette from "./MaProchaineRecette";

require("mutationobserver-shim");

jest.mock("axios");
let recettes;
let ingredientsFrigo;
let ingredientsCatalogue;
let categoriesCatalogue;
let axiosResponseIngredients;
let axiosResponseRecettes;
let axiosResponseIngredientsFrigo;
let axiosResponseCategories;

beforeEach(() => {
  recettes = [
    {
      id: 1,
      categories: ["Plat"],
      titre: "Salade de pommes de terre radis",
      ingredients: [
        { ingredient: "pommes de terre", quantite: "1", unite: "kg" },
        { ingredient: "oeufs", quantite: "3", unite: "pièce(s)" },
        { ingredient: "vinaigre non balsamique", quantite: "1", unite: "cas" },
        { ingredient: "radis", quantite: "2", unite: "botte(s)" },
        { ingredient: "oignons bottes", quantite: "2", unite: "pièce(s)" },
        { ingredient: "yaourt grec", quantite: "1", unite: "pièce(s)" },
        { ingredient: "mayonnaise", quantite: "1", unite: "cas" },
        { ingredient: "moutarde", quantite: "0.5", unite: "cas" },
        { ingredient: "ail", quantite: "1", unite: "gousse(s)" },
      ],
      duree: "35 min",
      description:
        "Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Couper les radis en rondelles. Emincer les échalottes et les oignons. Couper les oeufs durs. Mettre le tout dans un saladier et rajouter le vinaigre. Mélanger. Préparer la sauce :  mélanger le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
    },
  ];
  ingredientsFrigo = [
    {
      id: 1,
      ingredient: "épinard",
      date_peremption: "2020-04-15",
      quantite: "60",
      unite: "g",
    },
  ];
  ingredientsCatalogue = [
    {
      nom: "Fraises",
    },
    {
      nom: "Sucre",
    },
  ];
  categoriesCatalogue = ["Entrée", "Plat", "Dessert"];
  axiosResponseIngredients = { data: ingredientsCatalogue };
  axiosResponseRecettes = { data: recettes };
  axiosResponseIngredientsFrigo = { data: ingredientsFrigo };
  axiosResponseCategories = { data: categoriesCatalogue };
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
        : Promise.resolve(axiosResponseIngredientsFrigo);
    } else if (url === "/catalogues/categories/") {
      return rejectedElement === "categories"
        ? Promise.reject(new Error(""))
        : Promise.resolve(axiosResponseCategories);
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
  it("renders only feasible recipes and fridge ingredients when click on that nav link", async () => {
    const { getByRole, getByText, queryByText } = render(
      <MaProchaineRecette recettes={recettes} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
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

  it("renders only ingredients of the catalog when click on that nav link", async () => {
    const { getByRole, queryByText, getByText } = render(
      <MaProchaineRecette recettes={recettes} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
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

  it("renders only recipes of the catalog when click on that nav link", async () => {
    const { getByRole, queryByText, getByText } = render(
      <MaProchaineRecette recettes={recettes} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
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
  it("fetches and displays ingredients of the fridge when click on that nav link", async () => {
    const { getByText, getByRole } = render(
      <MaProchaineRecette recettes={recettes} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    navigateTo("Ma prochaine recette", getByRole);
    const epinard = getByText(/épinard/);
    expect(epinard).toBeInTheDocument();
  });

  it("fetches and displays ingredients of the catalog when click on that nav link", async () => {
    const { getByRole, getByText } = render(
      <MaProchaineRecette recettes={recettes} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    navigateTo("Catalogue des ingrédients", getByRole);
    const fraises = getByText("Fraises");
    expect(fraises).toBeInTheDocument();
  });

  it("fetches and displays recipes of the catalog when click on that nav link", async () => {
    const { getByRole, getByText } = render(
      <MaProchaineRecette recettes={recettes} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    navigateTo("Catalogue des recettes", getByRole);
    const salade = getByText("Salade de pommes de terre radis");
    expect(salade).toBeInTheDocument();
  });

  it(`fetches and displays categories of the catalog when click on catalog recipes 
  nav link`, async () => {
    const { getByRole, getByText } = render(
      <MaProchaineRecette recettes={recettes} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    navigateTo("Catalogue des recettes", getByRole);
    const entree = getByText("Entrée");
    expect(entree).toBeInTheDocument();
  });
});

describe("displays correct error message on bad fetch", () => {
  it("displays an error message if the ingredient fetch was not successful", async () => {
    mockAxiosGet("ingredients");
    const { getByText } = render(<MaProchaineRecette recettes={recettes} />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the reciepe fetch was not successful", async () => {
    mockAxiosGet("recettes");
    const { getByText } = render(<MaProchaineRecette recettes={recettes} />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the fridge ingredient fetch was not successful", async () => {
    mockAxiosGet("frigo");
    const { getByText } = render(<MaProchaineRecette recettes={recettes} />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });

  it("displays an error message if the categories fetch was not successful", async () => {
    mockAxiosGet("categories");
    const { getByText } = render(<MaProchaineRecette recettes={recettes} />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
    expect(error).toBeInTheDocument();
  });
});

describe("Handle correctly new ingredientCatalogue", () => {
  it(`takes into account newly entered ingredient in ingredientsCatalogue by giving suggestions when an ingredient name is being entered in IngredientsFrigo`, async () => {
    const maProchaineRecette = render(
      <MaProchaineRecette recettes={recettes} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    await addIngredientCatalogue(maProchaineRecette, "Navets");
    const { getByLabelText, getByTestId, getByRole } = maProchaineRecette;
    navigateTo("Ma prochaine recette", getByRole);
    const inputNomFrigo = getByLabelText("Nom de l'ingrédient :");
    fireEvent.change(inputNomFrigo, { target: { value: "Nav" } });
    const navets = getByTestId("suggestions");
    expect(navets.value).toEqual("Navets");
  });

  it(`takes into account newly entered ingredient in ingredientsCatalogue by giving suggestions when an ingredient name is being entered in RecettesCatalogue`, async () => {
    const maProchaineRecette = render(
      <MaProchaineRecette recettes={recettes} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(4));
    await addIngredientCatalogue(maProchaineRecette, "Coriandre");
    const { getByLabelText, getByTestId, getByRole } = maProchaineRecette;
    navigateTo("Catalogue des recettes", getByRole);
    const inputNomRecettesCatalogue = getByLabelText("Nom :");
    fireEvent.change(inputNomRecettesCatalogue, { target: { value: "Cor" } });
    const coriandre = getByTestId("suggestions");
    expect(coriandre.value).toEqual("Coriandre");
  });

  async function addIngredientCatalogue(maProchaineRecette, nom) {
    const axiosPostResponse = { data: { nom: nom } };
    axios.post.mockResolvedValue(axiosPostResponse);
    const { getByLabelText, getByText, getByRole } = maProchaineRecette;
    navigateTo("Catalogue des ingrédients", getByRole);
    const inputNomCatalogue = getByLabelText("Nom de l'ingrédient à ajouter :");
    const submitButtonCatalogue = getByText("Envoyer");
    fireEvent.change(inputNomCatalogue, { target: { value: nom } });
    fireEvent.click(submitButtonCatalogue);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  }
});
