
import React from 'react';
import { render } from '@testing-library/react';
import IngredientsFrigo from './IngredientsFrigo';

let ingredientsFrigo

beforeEach(() => {
  ingredientsFrigo = [
    {
      id : 1,
      nom : "épinard",
      datePeremption : new Date(2020, 4, 15),
      quantite : "60g",
    },
    {
      id : 2,
      nom : "céleri rave",
      datePeremption : new Date(2020, 3, 13),
      quantite : "1kg",
    }
  ]
});

it('renders names of ingredients', () => {
  const { getByText } = render(<IngredientsFrigo ingredients={ingredientsFrigo} />);
  const ingredient1 = getByText("épinard", { exact: false })
  expect(ingredient1).toBeInTheDocument();
});

it('renders expiration dates of ingredients', () => {
  const { getByText } = render(<IngredientsFrigo ingredients={ingredientsFrigo} />);
  const ingredient2 = getByText("céleri rave", { exact: false })
  const expectedDate = ingredientsFrigo[1].datePeremption.toLocaleDateString()
  expect(ingredient2.textContent).toContain(expectedDate);
});

it('renders quantities of ingredients', () => {
  const { getByText } = render(<IngredientsFrigo ingredients={ingredientsFrigo} />);
  const ingredient1 = getByText("épinard", { exact: false })
  expect(ingredient1.textContent).toContain("60g");
});

it('renders the right number of ingredients', () => {
  const { getAllByRole } = render(<IngredientsFrigo ingredients={ingredientsFrigo} />);
  const listItems = getAllByRole('listitem')
  expect(listItems).toHaveLength(2)
});
