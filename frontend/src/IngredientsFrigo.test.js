import React from "react";
import { render, fireEvent, within, act } from "@testing-library/react";
import IngredientsFrigo from "./IngredientsFrigo";
import axios from "axios";

require("mutationobserver-shim");

jest.mock("axios");
let ingredientsCatalogue;
let ingredientsFrigo;

beforeEach(() => {
  ingredientsCatalogue = [
    {
      nom: "Fraises",
    },
    {
      nom: "Poires",
    },
    {
      nom: "Framboises",
    },
    {
      nom: "Carottes",
    },
  ];

  ingredientsFrigo = [
    {
      id: 1,
      nom: "épinard",
      datePeremption: new Date(2100, 4, 15),
      quantite: "60",
      unite: "g",
    },
    {
      id: 2,
      nom: "céleri rave",
      datePeremption: new Date(2100, 3, 13),
      quantite: "1",
      unite: "kg",
    },
  ];
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("correct display of an ingredient", () => {
  it("renders names of ingredients", () => {
    const { getByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const ingredient1 = getByText("épinard", { exact: false });
    expect(ingredient1).toBeInTheDocument();
  });

  it("renders expiration dates of ingredients", () => {
    const { getByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const ingredient2 = getByText("céleri rave", { exact: false });
    const expectedDate = ingredientsFrigo[1].datePeremption.toLocaleDateString();
    expect(ingredient2.textContent).toContain(expectedDate);
  });

  it("renders quantities of ingredients", () => {
    const { getByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const ingredient1 = getByText("épinard", { exact: false });
    expect(ingredient1.textContent).toContain("60");
  });

  it("renders units of ingredients", () => {
    const { getByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const ingredient1 = getByText("épinard", { exact: false });
    expect(ingredient1.textContent).toContain("60g");
  });

  it("renders the right number of ingredients", () => {
    const { getAllByRole } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });
});

describe("functionalities work properly", () => {
  it("removes the correct ingredient when clicking on remove button", () => {
    const { getByText, getAllByRole } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const ingredient = getByText("épinard", { exact: false });
    const button = within(ingredient).getByText("Supprimer");
    fireEvent.click(button);
    const listItems = getAllByRole("listitem");
    expect(ingredient).not.toBeInTheDocument();
    expect(listItems).toHaveLength(1);
  });

  it("adds the correct ingredient when filling the form and clicking on submit", async () => {
    const { getByLabelText, getByText, getAllByRole } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const values = ["Carottes", 1, "2100-04-03", "kg"];
    await addIngredient(getByLabelText, getByText, values);
    const ingredient = getByText("Carottes", { exact: false });
    const listItems = getAllByRole("listitem");
    const expectedDate = new Date("2100-04-03");
    expect(listItems).toHaveLength(3);
    expect(ingredient.textContent).toContain("1kg");
    expect(ingredient.textContent).toContain(expectedDate.toLocaleDateString());
  });

  it(`does not add the ingredient if no quantity was provided`, async () => {
    await checkMissingInput("quantité");
  });

  it(`does not add the ingredient if no date was provided`, async () => {
    await checkMissingInput("date");
  });

  it(`does not add the ingredient if no unit was provided`, async () => {
    await checkMissingInput("unité");
  });

  async function checkMissingInput(inputName) {
    const { getByLabelText, getByText, queryByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    await addIngredient(
      getByLabelText,
      getByText,
      ["kiwi", 1, "2100-04-03", "kg"],
      [inputName]
    );
    const ingredient = queryByText(/kiwi/);
    expect(ingredient).not.toBeInTheDocument();
  }

  it(`does not add the ingredient if no name was provided`, async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    await addIngredient(
      getByLabelText,
      getByText,
      ["kiwi", 100, "2100-04-03", "kg"],
      ["nom"]
    );
    const ingredient = queryByText(/100kg/);
    expect(ingredient).not.toBeInTheDocument();
  });

  it(`does not add the ingredient if quantity is negative or null`, async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const values = ["kiwi", -1, "2100-04-03", "kg"];
    await addIngredient(getByLabelText, getByText, values);
    let kiwi = queryByText(/kiwi/);
    expect(kiwi).not.toBeInTheDocument();
    addIngredient(getByLabelText, getByText, ["kiwi", 0, "2100-04-03", "g"]);
    kiwi = queryByText(/kiwi/);
    expect(kiwi).not.toBeInTheDocument();
  });

  it(`does not add the ingredient if the given date is older than the current date`, async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const values = ["kiwi", 5, "2019-04-03", "g"];
    await addIngredient(getByLabelText, getByText, values);
    let kiwi = queryByText(/kiwi/);
    expect(kiwi).not.toBeInTheDocument();
  });

  it(`does not add the ingredient if the ingredient is not in ingredientsCatalogue`, () => {
    const { getByLabelText, getByText, queryByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    addIngredient(getByLabelText, getByText, ["Poireaux", 50, "g"]);
    const poireaux = queryByText(/Poireaux : /);
    expect(poireaux).not.toBeInTheDocument();
  });

  it(`provides the right proposals when a letter is entered in the input of the ingredient name`, () => {
    const { getByLabelText, getAllByTestId } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
      />
    );
    const inputIngredientName = getByLabelText("Nom de l'ingrédient :");
    fireEvent.change(inputIngredientName, { target: { value: "f" } });
    const options = getAllByTestId("suggestions");
    let fraises = options[0];
    let framboises = options[1];
    expect(options).toHaveLength(2);
    expect(fraises.value).toEqual("Fraises");
    expect(framboises.value).toEqual("Framboises");
  });

  async function addIngredient(
    getByLabelText,
    getByText,
    value,
    missingFields = []
  ) {
    const axiosPostResponse = {
      data: {
        id: 3,
        ingredient: value[0],
        date_peremption: value[2],
        quantite: value[1] + "",
        unite: value[3],
      },
    };
    axios.post.mockResolvedValue(axiosPostResponse);
    const inputNom = getByLabelText("Nom de l'ingrédient :");
    const inputQuantite = getByLabelText("Quantité :");
    const inputDate = getByLabelText("Date de péremption :");
    const selectedUnit = getByLabelText("Unité");
    const submitButton = getByText("Confirmer");
    if (!missingFields.includes("nom")) {
      fireEvent.change(inputNom, { target: { value: value[0] } });
    }
    if (!missingFields.includes("quantité")) {
      fireEvent.change(inputQuantite, { target: { value: value[1] } });
    }
    if (!missingFields.includes("date")) {
      fireEvent.change(inputDate, { target: { value: value[2] } });
    }
    if (!missingFields.includes("unité")) {
      fireEvent.change(selectedUnit, { target: { value: value[3] } });
    }
    await act(async () => {
      fireEvent.click(submitButton);
    });
  }
});
