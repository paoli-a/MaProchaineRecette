import React from "react";
import { render } from "@testing-library/react";
import IngredientsList from "./IngredientsList";

let ingredients;
let priorityIngredients;
let unsureIngredients;

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
