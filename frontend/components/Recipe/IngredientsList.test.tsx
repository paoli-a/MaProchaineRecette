import { render } from "@testing-library/react";
import React from "react";
import { RecipeIngredient } from "../../constants/types";
import IngredientsList from "./IngredientsList";

let ingredients: RecipeIngredient[];
let priorityIngredients: string[];
let unsureIngredients: string[];

beforeEach(() => {
  ingredients = [
    { ingredient: "pommes de terre", amount: "1", unit: "kg" },
    { ingredient: "oeufs", amount: "3", unit: "pièce(s)" },
    { ingredient: "vinaigre non balsamique", amount: "1", unit: "cas" },
    { ingredient: "radis", amount: "2", unit: "botte(s)" },
    { ingredient: "oignons bottes", amount: "2", unit: "pièce(s)" },
    { ingredient: "yaourt grec", amount: "1", unit: "pièce(s)" },
    { ingredient: "mayonnaise", amount: "1", unit: "cas" },
    { ingredient: "moutarde", amount: "0.5", unit: "cas" },
    { ingredient: "ail", amount: "1", unit: "gousse(s)" },
  ];
  priorityIngredients = ["mayonnaise"];
  unsureIngredients = ["radis", "ail"];
});

it("renders a list of ingredients", () => {
  const { getByText } = render(
    <IngredientsList
      ingredients={ingredients}
      priorityIngredients={priorityIngredients}
      unsureIngredients={unsureIngredients}
    />
  );
  const ingredient1 = getByText("pommes de terre", { exact: false });
  const ingredient2 = getByText("radis", { exact: false });
  expect(ingredient1).toBeInTheDocument();
  expect(ingredient2).toBeInTheDocument();
});

it("renders a list wich contains the right number of ingredients", () => {
  const { getAllByRole } = render(
    <IngredientsList
      ingredients={ingredients}
      priorityIngredients={priorityIngredients}
      unsureIngredients={unsureIngredients}
    />
  );
  const listItems = getAllByRole("listitem");
  expect(listItems).toHaveLength(9);
});

it("surrounds priority ingredients with strong tags", () => {
  const { getAllByTestId } = render(
    <IngredientsList
      ingredients={ingredients}
      priorityIngredients={priorityIngredients}
      unsureIngredients={unsureIngredients}
    />
  );
  const strongTags = getAllByTestId("strong-tag");
  expect(strongTags).toHaveLength(1);
  expect(strongTags[0].textContent).toContain("mayonnaise");
});

it("surrounds unsure ingredients with em tags", () => {
  const { getAllByTitle } = render(
    <IngredientsList
      ingredients={ingredients}
      priorityIngredients={priorityIngredients}
      unsureIngredients={unsureIngredients}
    />
  );
  const emTags = getAllByTitle(
    "Il n'y a peut-être pas la bonne quantité de cet ingredient"
  );
  expect(emTags).toHaveLength(2);
  expect(emTags[0].textContent).toContain("radis");
  expect(emTags[1].textContent).toContain("ail");
});
