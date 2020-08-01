import React from "react";
import {
  render,
  fireEvent,
  within,
  act,
  waitFor,
} from "@testing-library/react";
import IngredientsFrigo from "./IngredientsFrigo";
import axios from "axios";

require("mutationobserver-shim");

jest.mock("axios");
let ingredientsCatalogue;
let ingredientsFrigo;
let unites;

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
  unites = ["kg", "g", "cl", "pièce(s)"];
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
        totalUnites={unites}
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
        totalUnites={unites}
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
        totalUnites={unites}
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
        totalUnites={unites}
      />
    );
    const ingredient1 = getByText("épinard", { exact: false });
    expect(ingredient1.textContent).toContain("60 g");
  });

  it("renders the right number of ingredients", () => {
    const { getAllByRole } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
        totalUnites={unites}
      />
    );
    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("updates ingredients when ingredientsFrigo prop changes", () => {
    const { getByText, rerender } = render(
      <IngredientsFrigo
        ingredients={[]}
        ingredientsPossibles={ingredientsCatalogue}
        totalUnites={unites}
      />
    );
    rerender(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
        totalUnites={unites}
      />
    );
    const ingredient1 = getByText("épinard", { exact: false });
    expect(ingredient1).toBeInTheDocument();
  });
});

it("displays provided units", () => {
  const { getByLabelText } = render(
    <IngredientsFrigo
      ingredients={ingredientsFrigo}
      ingredientsPossibles={ingredientsCatalogue}
      totalUnites={unites}
    />
  );
  const unitSelect = getByLabelText("Unité");
  const kg = within(unitSelect).getByText("kg");
  const pieces = within(unitSelect).getByText("pièce(s)");
  expect(kg).toBeInTheDocument();
  expect(pieces).toBeInTheDocument();
});

describe("functionalities work properly", () => {
  it("removes the correct ingredient when clicking on remove button", async () => {
    const { getByText, getAllByRole } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
        totalUnites={unites}
      />
    );
    const axiosDeleteResponse = { data: "" };
    axios.delete.mockResolvedValue(axiosDeleteResponse);
    const ingredient = getByText("épinard", { exact: false });
    const button = within(ingredient).getByText("Supprimer");
    fireEvent.click(button);
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    const listItems = getAllByRole("listitem");
    expect(ingredient).not.toBeInTheDocument();
    expect(listItems).toHaveLength(1);
  });

  it(`displays an error message and keeps the ingredient if the ingredient removal
was not successful on backend side`, async () => {
    const { getByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
        totalUnites={unites}
      />
    );
    const axiosDeleteResponse = { data: "" };
    axios.delete.mockRejectedValue(axiosDeleteResponse);
    const ingredientToRemoved = getByText("épinard", { exact: false });
    const button = within(ingredientToRemoved).getByText("Supprimer");
    fireEvent.click(button);
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    expect(ingredientToRemoved).toBeInTheDocument();
    const error = getByText(
      /La suppression a échoué. Veuillez réessayer ultérieurement./
    );
    expect(error).toBeInTheDocument();
  });

  it("adds the correct ingredient when filling the form and clicking on submit", async () => {
    const { getByLabelText, getByText, getAllByRole } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
        totalUnites={unites}
      />
    );
    const values = ["Carottes", 1, "2100-04-03", "kg"];
    await addIngredient(getByLabelText, getByText, values);
    const ingredient = getByText("Carottes", { exact: false });
    const listItems = getAllByRole("listitem");
    const expectedDate = new Date("2100-04-03");
    expect(listItems).toHaveLength(3);
    expect(ingredient.textContent).toContain("1 kg");
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
        totalUnites={unites}
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
        totalUnites={unites}
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
        totalUnites={unites}
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
        totalUnites={unites}
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
        totalUnites={unites}
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
        totalUnites={unites}
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

  it(`displays an error message and does not add the ingredient if the ingredient adding
was not successful on backend side`, async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsCatalogue}
        totalUnites={unites}
      />
    );
    const axiosPostResponse = {};
    axios.post.mockRejectedValue(axiosPostResponse);
    const inputNom = getByLabelText("Nom de l'ingrédient :");
    const inputQuantite = getByLabelText("Quantité :");
    const inputDate = getByLabelText("Date de péremption :");
    const selectedUnit = getByLabelText("Unité");
    const submitButton = getByText("Confirmer");
    fireEvent.change(inputNom, { target: { value: "Poires" } });
    fireEvent.change(inputQuantite, { target: { value: 100 } });
    fireEvent.change(inputDate, { target: { value: "2100-04-03" } });
    fireEvent.change(selectedUnit, { target: { value: "kg" } });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    const ingredientToAdd = queryByText("kiwi", { exact: false });
    expect(ingredientToAdd).not.toBeInTheDocument();
    const error = getByText(/L'ajout de l'ingrédient a échoué/);
    expect(error).toBeInTheDocument();
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
    if (!missingFields) {
      await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    }
  }
});
