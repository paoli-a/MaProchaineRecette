import React from "react";
import {
  render,
  fireEvent,
  act,
  within,
  waitFor,
} from "@testing-library/react";
import axios from "axios";
import MaProchaineRecette from "./MaProchaineRecette";

require("mutationobserver-shim");

jest.mock("axios");
let recettes;
let ingredientsFrigo;
let ingredientsCatalogue;
let axiosResponse;

beforeEach(() => {
  recettes = [
    {
      id: 1,
      categorie: ["Plat"],
      titre: "Salade de pommes de terre radis",
      ingredients: {
        "pommes de terre": "1 kg",
        oeufs: "3",
        "vinaigre non balsamique": "1 cas",
        radis: "2 bottes",
        "oignons bottes": "2 cas",
        "yaourt grec": "1",
        mayonnaise: "1 cas",
        moutarde: "1/2 cas",
        ail: "1 gousse",
      },
      temps: "35 min",
      description:
        "Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Couper les radis en rondelles. Emincer les échalottes et les oignons. Couper les oeufs durs. Mettre le tout dans un saladier et rajouter le vinaigre. Mélanger. Préparer la sauce :  mélanger le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
    },
  ];

  ingredientsFrigo = [
    {
      id: 1,
      nom: "épinard",
      datePeremption: new Date(2020, 4, 15),
      quantite: "60g",
    },
  ];

  ingredientsCatalogue = [
    {
      id: 10,
      nom: "Fraises",
    },
    {
      id: 11,
      nom: "Sucre",
    },
  ];
  axiosResponse = { data: ingredientsCatalogue };
  axios.get.mockResolvedValue(axiosResponse);
});

afterEach(() => {
  jest.clearAllMocks();
});

it("renders only next recipes and fridge ingredients at start", async () => {
  const { getByText, queryByText } = render(
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
    />
  );
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  const prochainesRecettes = getByText("Mes prochaines recettes");
  const frigo = getByText("Voici les ingrédients du frigo !");
  const toutesMesRecettes = queryByText("Catalogue de toutes mes recettes");
  const tousMesIngredients = queryByText("Catalogue de tous mes ingrédients");
  expect(prochainesRecettes).toBeInTheDocument();
  expect(frigo).toBeInTheDocument();
  expect(toutesMesRecettes).not.toBeInTheDocument();
  expect(tousMesIngredients).not.toBeInTheDocument();
});

const navigateTo = (linkText, getByRole) => {
  const nav = getByRole("navigation");
  const navElement = within(nav).getByText(linkText);
  fireEvent.click(navElement);
};

it("renders only ingredients of the catalog when click on that nav link", async () => {
  const { getByRole, queryByText, getByText } = render(
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
    />
  );
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
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

it("fetches and displays ingredients of the catalog when click on that nav link", async () => {
  const { getByRole, getByText } = render(
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
    />
  );
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  navigateTo("Catalogue des ingrédients", getByRole);
  const fraises = getByText("Fraises");
  expect(fraises).toBeInTheDocument();
});

it("displays an error message if the ingredient fetch was not successful", async () => {
  axios.get.mockRejectedValue({});
  const { getByText } = render(
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
    />
  );
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  const error = getByText(/Il y a eu une erreur vis-à-vis du serveur/);
  expect(error).toBeInTheDocument();
});

it("renders only recipes of the catalog when click on that nav link", async () => {
  const { getByRole, queryByText, getByText } = render(
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
    />
  );
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
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

it(`takes into account newly entered ingredient in ingredientsCatalogue by giving suggestions when an ingredient name is being entered in IngredientsFrigo`, async () => {
  const maProchaineRecette = render(
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
    />
  );
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
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
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
    />
  );
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  await addIngredientCatalogue(maProchaineRecette, "Coriandre");
  const { getByLabelText, getByTestId, getByRole } = maProchaineRecette;
  navigateTo("Catalogue des recettes", getByRole);
  const inputNomRecettesCatalogue = getByLabelText("Nom :");
  fireEvent.change(inputNomRecettesCatalogue, { target: { value: "Cor" } });
  const coriandre = getByTestId("suggestions");
  expect(coriandre.value).toEqual("Coriandre");
});

async function addIngredientCatalogue(maProchaineRecette, nom) {
  const axiosPostResponse = { data: { id: 3, nom: nom } };
  axios.post.mockResolvedValue(axiosPostResponse);
  const { getByLabelText, getByText, getByRole } = maProchaineRecette;
  navigateTo("Catalogue des ingrédients", getByRole);
  const inputNomCatalogue = getByLabelText("Nom de l'ingrédient à ajouter :");
  const submitButtonCatalogue = getByText("Envoyer");
  fireEvent.change(inputNomCatalogue, { target: { value: nom } });
  fireEvent.click(submitButtonCatalogue);
  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
}
