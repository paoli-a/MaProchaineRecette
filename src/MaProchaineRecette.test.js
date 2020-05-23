import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import MaProchaineRecette from "./MaProchaineRecette";

require("mutationobserver-shim");

let recettes;
let ingredientsFrigo;
let ingredientsCatalogue;

beforeEach(() => {
  recettes = [
    {
      id: "001",
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
});

it("renders recipes", () => {
  const { queryAllByText } = render(
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
      ingredientsCatalogue={ingredientsCatalogue}
    />
  );
  const titreRecette = queryAllByText("Salade de pommes de terre radis");
  expect(titreRecette).not.toHaveLength(0);
});

it("renders fridge ingredients", () => {
  const { getByText } = render(
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
      ingredientsCatalogue={ingredientsCatalogue}
    />
  );
  const ingredientName = getByText("épinard", { exact: false });
  expect(ingredientName).toBeInTheDocument();
});

it(`takes into account newly entered ingredient in ingredientsCatalogue by giving suggestions when an ingredient name is being entered in IngredientsFrigo`, async () => {
  const maProchaineRecette = render(
    <MaProchaineRecette
      recettes={recettes}
      ingredientsFrigo={ingredientsFrigo}
      ingredientsCatalogue={ingredientsCatalogue}
    />
  );
  await addIngredientCatalogue(maProchaineRecette, "Navets");
  const { getByLabelText, getByTestId } = maProchaineRecette;
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
      ingredientsCatalogue={ingredientsCatalogue}
    />
  );
  await addIngredientCatalogue(maProchaineRecette, "Coriandre");
  const { getByLabelText, getByTestId } = maProchaineRecette;
  const inputNomRecettesCatalogue = getByLabelText("Nom :");
  fireEvent.change(inputNomRecettesCatalogue, { target: { value: "Cor" } });
  const coriandre = getByTestId("suggestions");
  expect(coriandre.value).toEqual("Coriandre");
});

async function addIngredientCatalogue(maProchaineRecette, nom) {
  const { getByLabelText, getByText } = maProchaineRecette;
  const inputNomCatalogue = getByLabelText("Nom de l'ingrédient à ajouter :");
  const submitButtonCatalogue = getByText("Envoyer");
  fireEvent.change(inputNomCatalogue, { target: { value: nom } });
  await act(async () => {
    fireEvent.click(submitButtonCatalogue);
  });
}
