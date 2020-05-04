import React from 'react';
import { render, fireEvent, act, within} from '@testing-library/react';
import RecettesCatalogue from './RecettesCatalogue';

require('mutationobserver-shim');

let recettes

beforeEach(() => {
  recettes = [
        {
          id : "001",
          categorie : ["Plat"],
          titre : "Salade de pommes de terre radis",
          ingredients : {"pommes de terre" : "1 kg", "oeufs" : "3", "vinaigre non balsamique" : "1 cas", "radis": "2 bottes", "oignons bottes" : "2 cas", "yaourt grec" : "1", "mayonnaise" : "1 cas", "moutarde" : "1/2 cas", "ail" : "1 gousse"},
          temps : "35 min",
          description : "Epluchez et coupez les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Coupez les radis en rondelles. Emincez les échalottes et les oignons. Coupez les oeufs durs. Mettre le tout dans un saladier et rajoutez le vinaigre. Mélangez. Préparez la sauce :  mélangez le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
        },

        {
          id : "002",
          categorie : ["Entrée"],
          titre : "Marinade de saumon fumé",
          ingredients : {"saumon fumé" : "200g", "citon vert" : "0,5", "vinaigre balsamique": "2 cas", "huile d'olive" : "2 cas", "échalotte" : "1", "herbes fraiches" : "1 cas"},
          temps : "11 h",
          description : "Emincez le saumon, l'échalotte et le persil. Ajoutez le vinaigre, l'huile, le citron et un peu de poivre. Mélangez et laissez mariner toute la nuit."
        },
      ]});

describe ("the adding recipe functionality works properly", () => {
  it('adds the correct recipe when filling the form and clicking on submit', async () => {
    const { getByLabelText, getByText } = render(<RecettesCatalogue totalRecettes={recettes}/>);
    await addRecipe(getByLabelText,getByText);
    const recette = getByText("Crumble aux poires", { exact: false });
    expect(recette).toBeInTheDocument()
  })

  async function addRecipe(getByLabelText, getByText) {
    const inputTitre =  getByLabelText("Titre de la recette :");
    const entree = getByLabelText("Entrée");
    const inputTemps =  getByLabelText("Temps total de la recette :");
    const inputDescription = getByLabelText("Corps de la recette :");
    const submitButton = getByText("Confirmer");
    fireEvent.change(inputTitre, { target: { value: 'Crumble aux poires' } });
    fireEvent.click(entree);
    fireEvent.change(inputTemps, { target: { value: '00:10' } })
    addIngredient(getByLabelText, getByText, ["poires", 1, "kg"])
    fireEvent.change(inputDescription, { target: { value: '"Épluchez et épépinez les poires. Coupez-les en dés.' } });
    await act(async () => {
      fireEvent.click(submitButton);
    })

    function addIngredient(getByLabelText, getByText, value) {
      const inputIngredientName = getByLabelText("Nom :");
      const inputQuantite = getByLabelText("Quantité nécessaire :");
      const selectedUnit = getByLabelText("Unité");
      fireEvent.change(inputIngredientName, { target: { value: value[0] } });
      fireEvent.change(inputQuantite, { target: { value: value[1] } });
      fireEvent.change(selectedUnit, { target: { value: value[2] } });
    }
  }
})

describe ("the removing recipe functionality works properly", () => {
  it("removes the recipe when clicking on the button", () => {
    const { getByText } = render(<RecettesCatalogue totalRecettes={recettes}/>);
    const recipeRemoved = getByText("Marinade de saumon fumé", { exact: false });
    const recipe = getByText("Salade de pommes de terre radis", { exact: false });
    const button = within(recipeRemoved).getByText("X");
    fireEvent.click(button);
    expect(recipeRemoved).not.toBeInTheDocument();
    expect(recipe).toBeInTheDocument();
  })
})
