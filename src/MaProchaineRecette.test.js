import React from 'react';
import { render } from '@testing-library/react';
import MaProchaineRecette from './MaProchaineRecette';

let recettes
let ingredientsFrigo

beforeEach(() => {
  recettes = [
    {
      id : "001",
      categorie : "plat",
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
});


test('renders recipes', () => {
  const { getByText } = render(<MaProchaineRecette recettes={recettes} ingredientsFrigo={ingredientsFrigo}/>);
  const titreRecette = getByText("Salade de pommes de terre radis");
  expect(titreRecette).toBeInTheDocument();
});

test('renders fridge ingredients', () => {
  const { getByText } = render(<MaProchaineRecette recettes={recettes} ingredientsFrigo={ingredientsFrigo}/>);
  const ingredientName = getByText("épinard", { exact: false });
  expect(ingredientName).toBeInTheDocument();
});
