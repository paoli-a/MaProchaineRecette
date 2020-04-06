
import React from 'react';
import { render, fireEvent, within } from '@testing-library/react';
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

describe("correct display of an ingredient", () => {
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
    const { getByText } = render(<IngredientsFrigo ingredients={ingredientsFrigo} />)
    const ingredient1 = getByText("épinard", { exact: false })
    expect(ingredient1.textContent).toContain("60g");
  });

  it('renders the right number of ingredients', () => {
    const { getAllByRole } = render(<IngredientsFrigo ingredients={ingredientsFrigo} />);
    const listItems = getAllByRole('listitem')
    expect(listItems).toHaveLength(2)
  });
})

describe("functionalities work properly", () => {
  it('removes the correct ingredient when clicking on remove button', () => {
    const { getByText, getAllByRole } = render(<IngredientsFrigo ingredients={ingredientsFrigo} />);
    const ingredient = getByText("épinard", { exact: false });
    const button = within(ingredient).getByText("Supprimer");
    fireEvent.click(button);
    const listItems = getAllByRole('listitem');
    expect(ingredient).not.toBeInTheDocument();
    expect(listItems).toHaveLength(1)
  });

  it('adds the correct ingredient when filling the form and clicking on submit', () => {
    const { getByLabelText, getByText, getAllByRole } = render(<IngredientsFrigo ingredients={ingredientsFrigo} />);
    addIngredient(getByLabelText,getByText);
    const ingredient = getByText("carotte", { exact: false });
    const listItems = getAllByRole('listitem');
    const expectedDate = new Date("2020-04-03");
    expect(listItems).toHaveLength(3);
    expect(ingredient.textContent).toContain("1kg");
    expect(ingredient.textContent).toContain(expectedDate.toLocaleDateString())
  })

  function addIngredient (getByLabelText, getByText) {
    const inputNom =  getByLabelText("Nom de l'ingrédient :");
    const inputQuantite = getByLabelText("Quantité :");
    const inputDate = getByLabelText("Date de péremption :");
    const selectedUnit = getByLabelText("Unité");
    const submitButton = getByText("Confirmer");
    fireEvent.change(inputNom, { target: { value: 'carotte' } });
    fireEvent.change(inputQuantite, { target: { value: '1' } });
    fireEvent.change(inputDate, { target: { value: '2020-04-03' } });
    fireEvent.change(selectedUnit, { target: { value: 'kg' } });
    fireEvent.click(submitButton);
  }
})
