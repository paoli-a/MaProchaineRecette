import React from "react";
import { render } from "@testing-library/react";
import IngredientsList from "./IngredientsList";

let ingredients;

beforeEach(() => {
  ingredients = {
    "pommes de terre": "1 kg",
    oeufs: "3",
    "vinaigre non balsamique": "1 cas",
    radis: "2 bottes",
    "oignons bottes": "2 cas",
    "yaourt grec": "1",
    mayonnaise: "1 cas",
    moutarde: "1/2 cas",
    ail: "1 gousse",
  };
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
