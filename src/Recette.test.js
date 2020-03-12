import React from 'react';
import { render } from '@testing-library/react';
import Recette from './Recette';

let recette

beforeEach(() => {
  recette = {
    id : "001",
    categorie : "plat",
    titre : "Salade de pommes de terre radis",
    ingredients : {"pommes de terre" : "1 kg", "oeufs" : "3", "vinaigre non balsamique" : "1 cas", "radis": "2 bottes", "oignons bottes" : "2 cas", "yaourt grec" : "1", "mayonnaise" : "1 cas", "moutarde" : "1/2 cas", "ail" : "1 gousse"},
    temps : "35 min",
    description : "Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Couper les radis en rondelles. Emincer les échalottes et les oignons. Couper les oeufs durs. Mettre le tout dans un saladier et rajouter le vinaigre. Mélanger. Préparer la sauce :  mélanger le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
  }
});

it('renders title element on the document', () => {
  const { getByText } = render(<Recette recette={recette} />);
  const titreRecette = getByText("Salade de pommes de terre radis");
  expect(titreRecette).toBeInTheDocument();
});

it('renders description element on the document', () => {
  const { getByText } = render(<Recette recette={recette} />);
  const descriptionRecette = getByText("Eplucher et couper les patates en rondelles et les cuire à l'eau.", { exact: false } );
  expect(descriptionRecette).toBeInTheDocument();
});
