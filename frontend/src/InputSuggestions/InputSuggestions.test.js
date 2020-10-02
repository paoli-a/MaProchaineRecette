import React from "react";
import { render, fireEvent } from "@testing-library/react";
import InputSuggestions from "./InputSuggestions";

let catalogIngredients;

beforeEach(() => {
  catalogIngredients = [
    {
      name: "Fraises",
    },
    {
      name: "Poires",
    },
    {
      name: "Framboises",
    },
    {
      name: "Beurre",
    },
  ];
});

it(`provides the right proposals when a letter is entered in the input of the ingredient name`, () => {
  let value = "";
  const handleChange = (val) => {
    value = val;
  };
  const { getByLabelText, getAllByTestId } = render(
    <p>
      <label htmlFor="ingredients">Ingrédients :</label>
      <InputSuggestions
        id="ingredients"
        elements={catalogIngredients}
        getElementText={(ingredient) => ingredient.name}
        onChangeValue={handleChange}
        value={value}
      />
    </p>
  );
  const inputIngredientName = getByLabelText("Ingrédients :");
  fireEvent.change(inputIngredientName, { target: { value: "fra" } });
  let options = getAllByTestId("suggestions");
  let fraises = options[0];
  let framboises = options[1];
  expect(fraises.value).toBe("Fraises");
  expect(framboises.value).toBe("Framboises");
  fireEvent.change(inputIngredientName, { target: { value: "fram" } });
  options = getAllByTestId("suggestions");
  fraises = options[0];
  expect(fraises.value).toBe("Framboises");
  expect(options).toHaveLength(1);
});
