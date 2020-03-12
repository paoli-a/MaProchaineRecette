import React from 'react';
import { render } from '@testing-library/react';
import RecettesAffichage from './RecettesAffichage';

let recettes

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

        {
          id : "002",
          categorie : "plat",
          titre : "Gratin pommes de terre panais",
          ingredients : {"pommes de terre" : "1 kg", "panais" : "4", "crème fraiche épaisse": "20 cl", "crème fraiche semi-épaisse" : "10 cl", "moutarde" : "1,5 cas", "gruillère rapé" : "70 g"},
          temps : "1 h",
          description : "Eplucher et couper les patates en rondelles et les cuire à l'eau. Eplucher et couper las panais en rondelles et les cuire à la vapeur. Préparer la sauce : dans une casserole à feu doux mélanger les deux crèmes puis ajouter la moutarde et assaisoner. Répartir les panais et les pommes de terre dans un plat, recouvrir de sauce puis de gruillère rapé. Faire gratiner au four."
        }
      ]});


test('renders title element of all the recipes', () => {
  const { getByText } = render(<RecettesAffichage recettes={recettes}/>);
  const titreRecette1 = getByText("Salade de pommes de terre radis");
  const titreRecette2 = getByText("Gratin pommes de terre panais");
  expect(titreRecette1).toBeInTheDocument();
  expect(titreRecette2).toBeInTheDocument();
});
