import React from "react";
import { render } from "@testing-library/react";
import IngredientsList from "./IngredientsList";

let ingredients;

beforeEach(() => {
  ingredients = [
    { ingredient: "pommes de terre", quantite: "1", unite: "kg" },
    { ingredient: "oeufs", quantite: "3", unite: "pièce(s)" },
    { ingredient: "vinaigre non balsamique", quantite: "1", unite: "cas" },
    { ingredient: "radis", quantite: "2", unite: "botte(s)" },
    { ingredient: "oignons bottes", quantite: "2", unite: "pièce(s)" },
    { ingredient: "yaourt grec", quantite: "1", unite: "pièce(s)" },
    { ingredient: "mayonnaise", quantite: "1", unite: "cas" },
    { ingredient: "moutarde", quantite: "0.5", unite: "cas" },
    { ingredient: "ail", quantite: "1", unite: "gousse(s)" },
  ];
});

it("renders a list of ingredients", () => {
  const { getByText } = render(<IngredientsList ingredients={ingredients} />);
  const ingredient1 = getByText("pommes de terre", { exact: false });
  const ingredient2 = getByText("radis", { exact: false });
  expect(ingredient1).toBeInTheDocument();
  expect(ingredient2).toBeInTheDocument();
});

it("renders a list wich contains the right number of ingredients", () => {
  const { getAllByRole } = render(
    <IngredientsList ingredients={ingredients} />
  );
  const listItems = getAllByRole("listitem");
  expect(listItems).toHaveLength(9);
});
