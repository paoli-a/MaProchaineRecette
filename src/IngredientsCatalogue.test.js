import React from 'react';
import { render, fireEvent, within, act} from '@testing-library/react';
import IngredientsCatalogue from './IngredientsCatalogue';

require('mutationobserver-shim');

let ingredientsCatalogue

beforeEach(() => {
  ingredientsCatalogue = [
    {
      id : 10,
      nom : "Fraises",
    },
    {
      id : 11,
      nom : "Mascarpone",
    }
  ]
});


it('removes the correct ingredient when clicking on remove button', () => {
  const { getByText, getAllByRole } = render(<IngredientsCatalogue ingredientsPossibles={ingredientsCatalogue}/>);
  const ingredient = getByText("Fraises", { exact: false });
  const button = within(ingredient).getByText("X");
  fireEvent.click(button);
  const listItems = getAllByRole('listitem');
  expect(ingredient).not.toBeInTheDocument();
  expect(listItems).toHaveLength(1)
});

it('adds the correct ingredient when filling the form and clicking on submit', async () => {
  const { getByLabelText, getByText, getAllByRole } = render(<IngredientsCatalogue ingredientsPossibles={ingredientsCatalogue}/>);
  const inputNom =  getByLabelText("Nom de l'ingrédient à ajouter :");
  const submitButton = getByText("Envoyer");
  fireEvent.change(inputNom, { target: { value: 'Chocolat' } });
  await act(async () => {
    fireEvent.click(submitButton);
  })
  const ingredient = getByText("Chocolat", { exact: false });
  const listItems = getAllByRole('listitem');
  expect(listItems).toHaveLength(3);
  expect(ingredient).toBeInTheDocument();
})
