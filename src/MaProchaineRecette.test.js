import React from 'react';
import { render } from '@testing-library/react';
import MaProchaineRecette from './MaProchaineRecette';

require('mutationobserver-shim');

let recettes
let ingredientsFrigo
let ingredientsCatalogue

beforeEach(() => {
  recettes = [
    {
      id : "001",
      categorie : ["Plat"],
      titre : "Salade de pommes de terre radis",
      ingredients : {"pommes de terre" : "1 kg", "oeufs" : "3", "vinaigre non balsamique" : "1 cas", "radis": "2 bottes", "oignons bottes" : "2 cas", "yaourt grec" : "1", "mayonnaise" : "1 cas", "moutarde" : "1/2 cas", "ail" : "1 gousse"},
      temps : "35 min",
      description : "Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Couper les radis en rondelles. Emincer les échalottes et les oignons. Couper les oeufs durs. Mettre le tout dans un saladier et rajouter le vinaigre. Mélanger. Préparer la sauce :  mélanger le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
    },
  ]

  ingredientsFrigo = [
    {
      id : 1,
      nom : "épinard",
      datePeremption : new Date(2020, 4, 15),
      quantite : "60g",
    }
  ]

  ingredientsCatalogue = [
    {
      id : 10,
      nom : "Fraises",
    },
    {
      id : 11,
      nom : "Sucre",
    }
  ]
});


test('renders recipes', () => {
  const { getByText } = render(<MaProchaineRecette
    recettes={recettes}
    ingredientsFrigo={ingredientsFrigo}
    ingredientsCatalogue={ingredientsCatalogue}/>);
  const titreRecette = getByText("Salade de pommes de terre radis");
  expect(titreRecette).toBeInTheDocument();
});

test('renders fridge ingredients', () => {
  const { getByText } = render(<MaProchaineRecette
    recettes={recettes}
    ingredientsFrigo={ingredientsFrigo}
    ingredientsCatalogue={ingredientsCatalogue}/>);
  const ingredientName = getByText("épinard", { exact: false });
  expect(ingredientName).toBeInTheDocument();
});
