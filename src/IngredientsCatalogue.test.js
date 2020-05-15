import React from 'react';
import { render, fireEvent, within, act, waitFor} from '@testing-library/react';
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
  const { getByText, getAllByRole } = render(<IngredientsCatalogue
    ingredientsPossibles={ingredientsCatalogue}/>);
  const ingredient = getByText("Fraises", { exact: false });
  const button = within(ingredient).getByText("X");
  fireEvent.click(button);
  const listItems = getAllByRole('listitem');
  expect(ingredient).not.toBeInTheDocument();
  expect(listItems).toHaveLength(1)
});

it('adds the correct ingredient when filling the form and clicking on submit', async () => {
  const { getByLabelText, getByText, getAllByRole } = render(<IngredientsCatalogue
    ingredientsPossibles={ingredientsCatalogue}/>);
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

describe ("the search bar functionality works properly", () => {
  it('displays the correct ingredients when a letter is entered in the search bar',
    async () => {
    const { getByText, queryByText, getByPlaceholderText } =
      render(<IngredientsCatalogue ingredientsPossibles={ingredientsCatalogue}/>);
    const searchBar = getByPlaceholderText("Recherche...")
    fireEvent.change(searchBar, { target: { value: "M" } });
    await waitFor(() => {
      expect(getByText("Mascarpone")).toBeInTheDocument()
    })
    expect(queryByText("Fraises")).not.toBeInTheDocument()
    fireEvent.change(searchBar, { target: { value: "Fra" } });
    await waitFor(() => {
      expect(getByText("Fraises")).toBeInTheDocument()
    })
    expect(queryByText("Mascarpone")).not.toBeInTheDocument()
  })

  it('redisplays all the ingredient of the catalog after a search', async () => {
    const { getByText, queryByText, getByPlaceholderText } =
      render(<IngredientsCatalogue ingredientsPossibles={ingredientsCatalogue}/>);
    const searchBar = getByPlaceholderText("Recherche...")
    fireEvent.change(searchBar, { target: { value: "fr" } });
    await waitFor(() => {
      expect(getByText("Fraises")).toBeInTheDocument()
    })
    expect(queryByText("Mascarpone")).not.toBeInTheDocument()
    fireEvent.change(searchBar, { target: { value: "" } });
    await waitFor(() => {
      expect(getByText("Fraises")).toBeInTheDocument()
      expect(getByText("Mascarpone")).toBeInTheDocument()
    })
  })
})
