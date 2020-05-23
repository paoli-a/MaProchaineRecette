import React from "react";
import { render, fireEvent, within, act } from "@testing-library/react";
import IngredientsCatalogue from "./IngredientsCatalogue";

require("mutationobserver-shim");

let ingredientsCatalogue;

beforeEach(() => {
  ingredientsCatalogue = [
    {
      id: 10,
      nom: "Fraises",
    },
    {
      id: 11,
      nom: "Mascarpone",
    },
  ];
});

const handleIngredientsPossibles = (ingredients) => {
  ingredientsCatalogue = ingredients;
};

const rerenderCatalogue = (rerender) => {
  rerender(
    <IngredientsCatalogue
      ingredientsPossibles={ingredientsCatalogue}
      updateIngredientsPossibles={handleIngredientsPossibles}
    />
  );
};

it("removes the correct ingredient when clicking on remove button", () => {
  const { getByText, getAllByRole, rerender } = render(
    <IngredientsCatalogue
      ingredientsPossibles={ingredientsCatalogue}
      updateIngredientsPossibles={handleIngredientsPossibles}
    />
  );
  const ingredient = getByText("Fraises", { exact: false });
  const button = within(ingredient).getByText("X");
  fireEvent.click(button);
  rerenderCatalogue(rerender);
  const listItems = getAllByRole("listitem");
  expect(ingredient).not.toBeInTheDocument();
  expect(listItems).toHaveLength(1);
});

it(`adds the correct ingredient when filling the form and clicking
  on submit`, async () => {
  const { getByLabelText, getByText, getAllByRole, rerender } = render(
    <IngredientsCatalogue
      ingredientsPossibles={ingredientsCatalogue}
      updateIngredientsPossibles={handleIngredientsPossibles}
    />
  );
  const inputNom = getByLabelText("Nom de l'ingrédient à ajouter :");
  const submitButton = getByText("Envoyer");
  fireEvent.change(inputNom, { target: { value: "Chocolat" } });
  await act(async () => {
    fireEvent.click(submitButton);
  });
  rerenderCatalogue(rerender);
  const ingredient = getByText("Chocolat", { exact: false });
  const listItems = getAllByRole("listitem");
  expect(listItems).toHaveLength(3);
  expect(ingredient).toBeInTheDocument();
});

describe("the search bar functionality works properly", () => {
  it(`displays the correct ingredients when a letter is entered in the
    search bar`, () => {
    const { getByText, queryByText, getByPlaceholderText } = render(
      <IngredientsCatalogue
        ingredientsPossibles={ingredientsCatalogue}
        updateIngredientsPossibles={handleIngredientsPossibles}
      />
    );
    const searchBar = getByPlaceholderText("Recherche...");
    fireEvent.change(searchBar, { target: { value: "M" } });
    expect(getByText("Mascarpone")).toBeInTheDocument();
    expect(queryByText("Fraises")).not.toBeInTheDocument();
    fireEvent.change(searchBar, { target: { value: "Fra" } });
    expect(getByText("Fraises")).toBeInTheDocument();
    expect(queryByText("Mascarpone")).not.toBeInTheDocument();
  });

  it("redisplays all the ingredient of the catalog after a search", () => {
    const { getByText, queryByText, getByPlaceholderText } = render(
      <IngredientsCatalogue
        ingredientsPossibles={ingredientsCatalogue}
        updateIngredientsPossibles={handleIngredientsPossibles}
      />
    );
    const searchBar = getByPlaceholderText("Recherche...");
    fireEvent.change(searchBar, { target: { value: "fr" } });
    expect(getByText("Fraises")).toBeInTheDocument();
    expect(queryByText("Mascarpone")).not.toBeInTheDocument();
    fireEvent.change(searchBar, { target: { value: "" } });
    expect(getByText("Fraises")).toBeInTheDocument();
    expect(getByText("Mascarpone")).toBeInTheDocument();
  });
});
