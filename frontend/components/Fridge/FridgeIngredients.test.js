/* eslint-disable testing-library/no-await-sync-query */
import React from "react";
import {
  render,
  fireEvent,
  within,
  act,
  waitFor,
} from "@testing-library/react";
import FridgeIngredients from "./FridgeIngredients";
import axios from "axios";
import { axiosGetGlobalMock, fridgeIngredients } from "../testUtils";
import { SWRConfig, cache } from "swr";

require("mutationobserver-shim");
jest.mock("axios");

beforeEach(() => {
  cache.clear();
  axiosGetGlobalMock();
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderIngredients = async () => {
  let app;
  await act(async () => {
    app = render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <FridgeIngredients />
      </SWRConfig>
    );
  });
  return app;
};

describe("correct display of an ingredient", () => {
  it("renders names of ingredients", async () => {
    const { getByText } = await renderIngredients();
    const ingredient1 = getByText("Epinards", { exact: false });
    expect(ingredient1).toBeInTheDocument();
  });

  it("renders expiration dates of ingredients", async () => {
    const { getByText } = await renderIngredients();
    const ingredient2 = getByText("Mascarpone", { exact: false });
    const parentListItem = ingredient2.parentElement;
    const expectedDateContent = fridgeIngredients[1].expiration_date.toLocaleDateString();
    const expectedDate = within(parentListItem).getByText(expectedDateContent);
    expect(expectedDate).toBeInTheDocument();
  });

  it("renders quantities of ingredients", async () => {
    const { getByText } = await renderIngredients();
    const ingredient1 = getByText("Epinards", { exact: false });
    const parentListItem = ingredient1.parentElement;
    const quantity = within(parentListItem).getByText(/60 /);
    expect(quantity).toBeInTheDocument();
  });

  it("renders units of ingredients", async () => {
    const { getByText } = await renderIngredients();
    const ingredient1 = getByText("Epinards", { exact: false });
    const parentListItem = ingredient1.parentElement;
    const unit = within(parentListItem).getByText(/ g/);
    expect(unit).toBeInTheDocument();
  });

  it("renders the right number of ingredients", async () => {
    const { getAllByRole } = await renderIngredients();
    const ingredients = getAllByRole("heading", { level: 3 });
    expect(ingredients).toHaveLength(3);
  });
});

it("displays provided units", async () => {
  const { getByLabelText } = await renderIngredients();
  const unitSelect = getByLabelText("Unité");
  const kg = within(unitSelect).getByText("kg");
  const pieces = within(unitSelect).getByText("pièce(s)");
  expect(kg).toBeInTheDocument();
  expect(pieces).toBeInTheDocument();
});

describe("functionalities work properly", () => {
  describe("remove functionality", () => {
    it("removes the correct ingredient when clicking on remove button", async () => {
      const {
        getByText,
        getAllByRole,
        queryByText,
      } = await renderIngredients();
      const axiosDeleteResponse = { data: "" };
      axios.delete.mockResolvedValue(axiosDeleteResponse);
      let ingredient = getByText("Epinards", { exact: false });
      const parentListItem = ingredient.parentElement;
      const button = within(parentListItem).getByAltText("Supprimer");
      fireEvent.click(button);
      axios.get.mockResolvedValue({
        data: [
          {
            id: 2,
            ingredient: "Mascarpone",
            expiration_date: new Date(2100, 4, 15),
            amount: "1",
            unit: "kg",
          },
          {
            id: 3,
            ingredient: "Poires",
            expiration_date: new Date(2100, 3, 13),
            amount: "1",
            unit: "kg",
          },
        ],
      });
      await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
      ingredient = queryByText("Epinards", { exact: false });
      expect(ingredient).not.toBeInTheDocument();
      const ingredients = getAllByRole("heading", { level: 3 });
      expect(ingredients).toHaveLength(2);
    });

    it(`displays an error message and keeps the ingredient if the ingredient removal
      was not successful on backend side`, async () => {
      const { getByText } = await renderIngredients();
      const axiosDeleteResponse = { data: "" };
      axios.delete.mockRejectedValue(axiosDeleteResponse);
      const ingredientToRemoved = getByText("Epinards", { exact: false });
      const parentListItem = ingredientToRemoved.parentElement;
      const button = within(parentListItem).getByAltText("Supprimer");
      fireEvent.click(button);
      await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
      expect(ingredientToRemoved).toBeInTheDocument();
      const error = getByText(
        /La suppression a échoué. Veuillez réessayer ultérieurement./
      );
      expect(error).toBeInTheDocument();
    });
  });

  describe("adding functionality", () => {
    it("adds the correct ingredient when filling the form and clicking on submit", async () => {
      const {
        getByLabelText,
        getByText,
        getAllByRole,
      } = await renderIngredients();
      axios.get.mockResolvedValue({
        data: [
          {
            id: 1,
            ingredient: "Epinards",
            expiration_date: new Date(2100, 4, 15),
            amount: "60",
            unit: "g",
          },
          {
            id: 2,
            ingredient: "Mascarpone",
            expiration_date: new Date(2100, 4, 15),
            amount: "1",
            unit: "kg",
          },
          {
            id: 3,
            ingredient: "Poires",
            expiration_date: new Date(2100, 3, 13),
            amount: "1",
            unit: "kg",
          },
          {
            id: 4,
            ingredient: "Fraises",
            expiration_date: new Date(2100, 3, 3),
            amount: "1",
            unit: "kg",
          },
        ],
      });
      const values = ["Fraises", 1, "2100-04-03", "kg"];
      await addIngredient(getByLabelText, getByText, values);
      const ingredient = getByText("Fraises", { exact: false });
      const expectedDate = new Date("2100-04-03");
      const ingredients = getAllByRole("heading", { level: 3 });
      expect(ingredients).toHaveLength(4);
      const parentListItem = ingredient.parentElement;
      const quantity = within(parentListItem).getByText("1 kg");
      const expectedDateString = within(parentListItem).getByText(
        expectedDate.toLocaleDateString()
      );
      expect(quantity).toBeInTheDocument();
      expect(expectedDateString).toBeInTheDocument();
    });

    it(`does not add the ingredient if no amount was provided`, async () => {
      await checkMissingInput("quantité");
    });

    it(`does not add the ingredient if no date was provided`, async () => {
      await checkMissingInput("date");
    });

    it(`does not add the ingredient if no unit was provided`, async () => {
      await checkMissingInput("unité");
    });

    async function checkMissingInput(inputName) {
      const {
        getByLabelText,
        getByText,
        queryByText,
      } = await renderIngredients();
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
      const {
        getByLabelText,
        getByText,
        queryByText,
      } = await renderIngredients();
      await addIngredient(
        getByLabelText,
        getByText,
        ["kiwi", 100, "2100-04-03", "kg"],
        ["name"]
      );
      const ingredient = queryByText(/100kg/);
      expect(ingredient).not.toBeInTheDocument();
      const errorMessage = getByText("Ce champ est obligatoire");
      expect(errorMessage).toBeInTheDocument();
    });

    it(`does not add the ingredient if amount is negative or null`, async () => {
      const {
        getByLabelText,
        getByText,
        queryByText,
      } = await renderIngredients();
      const values = ["kiwi", -1, "2100-04-03", "kg"];
      await addIngredient(getByLabelText, getByText, values);
      let kiwi = queryByText(/kiwi/);
      expect(kiwi).not.toBeInTheDocument();
      await addIngredient(getByLabelText, getByText, [
        "kiwi",
        0,
        "2100-04-03",
        "g",
      ]);
      kiwi = queryByText(/kiwi/);
      expect(kiwi).not.toBeInTheDocument();
    });

    it(`does not add the ingredient if the given date is older than the current date`, async () => {
      const {
        getByLabelText,
        getByText,
        queryByText,
      } = await renderIngredients();
      const values = ["kiwi", 5, "2019-04-03", "g"];
      await addIngredient(getByLabelText, getByText, values);
      let kiwi = queryByText(/kiwi/);
      expect(kiwi).not.toBeInTheDocument();
    });

    it(`does not add the ingredient if the ingredient is not in catalogIngredients`, async () => {
      const {
        getByLabelText,
        getByText,
        queryByText,
      } = await renderIngredients();
      await addIngredient(getByLabelText, getByText, [
        "Poireaux",
        50,
        "2100-04-03",
        "g",
      ]);
      const poireaux = queryByText(/Poireaux : /);
      expect(poireaux).not.toBeInTheDocument();
      const errorMessage = getByText(
        /Cet ingrédient n'existe pas dans le catalogue d'ingrédients. Vous pouvez l'y ajouter/
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it(`adds the ingredient returned by the backend and removes the ingredient that
   have the same id if there is one`, async () => {
      const {
        getByLabelText,
        getByText,
        queryByText,
      } = await renderIngredients();
      axios.get.mockResolvedValue({
        data: [
          {
            id: 1,
            ingredient: "Epinards",
            expiration_date: new Date(2100, 4, 15),
            amount: "60",
            unit: "g",
          },
          {
            id: 2,
            ingredient: "Mascarpone",
            expiration_date: new Date(2100, 4, 15),
            amount: "1",
            unit: "kg",
          },
          {
            id: 3,
            ingredient: "Poires",
            expiration_date: new Date(2100, 3, 13),
            amount: "1",
            unit: "kg",
          },
          {
            id: 4,
            ingredient: "Fraises",
            expiration_date: new Date(2100, 3, 3),
            amount: "1153",
            unit: "g",
          },
        ],
      });
      await addIngredient(getByLabelText, getByText, [
        "Fraises",
        1153,
        "2100-04-03",
        "g",
      ]);
      let fraises = getByText(/Fraises/);
      expect(fraises).toBeInTheDocument();
      const axiosPostResponse = {
        data: {
          id: 4,
          ingredient: "Fraises",
          expiration_date: "2100-04-03",
          amount: "28.15",
          unit: "kg",
        },
      };
      axios.post.mockResolvedValue(axiosPostResponse);
      const inputName = getByLabelText("Nom de l'ingrédient :");
      const inputAmount = getByLabelText("Quantité :");
      const inputDate = getByLabelText("Date de péremption :");
      const selectedUnit = getByLabelText("Unité");
      const submitButton = getByText("Ajouter");
      fireEvent.change(inputName, { target: { value: "Fraises" } });
      fireEvent.change(inputAmount, { target: { value: "27" } });
      fireEvent.change(inputDate, { target: { value: "2100-04-03" } });
      fireEvent.change(selectedUnit, { target: { value: "kg" } });
      axios.get.mockResolvedValue({
        data: [
          {
            id: 1,
            ingredient: "Epinards",
            expiration_date: new Date(2100, 4, 15),
            amount: "60",
            unit: "g",
          },
          {
            id: 2,
            ingredient: "Mascarpone",
            expiration_date: new Date(2100, 4, 15),
            amount: "1",
            unit: "kg",
          },
          {
            id: 3,
            ingredient: "Poires",
            expiration_date: new Date(2100, 3, 13),
            amount: "1",
            unit: "kg",
          },
          {
            id: 4,
            ingredient: "Fraises",
            expiration_date: new Date(2100, 3, 3),
            amount: "28.15",
            unit: "kg",
          },
        ],
      });
      await act(async () => {
        fireEvent.click(submitButton);
      });
      await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));
      fraises = getByText(/Fraises/);
      expect(fraises).toBeInTheDocument();
      expect(queryByText(/53/)).not.toBeInTheDocument();
      expect(queryByText(/27/)).not.toBeInTheDocument();
      expect(getByText(/28.15/)).toBeInTheDocument();
    });

    it(`displays an error message and does not add the ingredient if the ingredient adding
      was not successful on backend side`, async () => {
      const {
        getByLabelText,
        getByText,
        queryByText,
      } = await renderIngredients();
      const axiosPostResponse = {};
      axios.post.mockRejectedValue(axiosPostResponse);
      const inputName = getByLabelText("Nom de l'ingrédient :");
      const inputAmount = getByLabelText("Quantité :");
      const inputDate = getByLabelText("Date de péremption :");
      const selectedUnit = getByLabelText("Unité");
      const submitButton = getByText("Ajouter");
      fireEvent.change(inputName, { target: { value: "Beurre" } });
      fireEvent.change(inputAmount, { target: { value: 100 } });
      fireEvent.change(inputDate, { target: { value: "2100-04-03" } });
      fireEvent.change(selectedUnit, { target: { value: "kg" } });
      await act(async () => {
        fireEvent.click(submitButton);
      });
      await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
      const ingredientToAdd = queryByText("Beurre", { exact: false });
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
          id: 4,
          ingredient: value[0],
          expiration_date: value[2],
          amount: value[1] + "",
          unit: value[3],
        },
      };
      axios.post.mockResolvedValue(axiosPostResponse);
      const inputName = getByLabelText("Nom de l'ingrédient :");
      const inputAmount = getByLabelText("Quantité :");
      const inputDate = getByLabelText("Date de péremption :");
      const selectedUnit = getByLabelText("Unité");
      const submitButton = getByText("Ajouter");
      if (!missingFields.includes("name")) {
        fireEvent.change(inputName, { target: { value: value[0] } });
      }
      if (!missingFields.includes("quantité")) {
        fireEvent.change(inputAmount, { target: { value: value[1] } });
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

  describe("edit functionality", () => {
    it(`transforms the firdge ingredient add form to an edit form when
     clicking on an edit button`, async () => {
      const {
        getByText,
        queryByText,
        getByDisplayValue,
      } = await renderIngredients();
      let ingredient = getByText("Epinards", { exact: false });
      const parentListItem = ingredient.parentElement;
      const button = within(parentListItem).getByAltText("Modifier");
      fireEvent.click(button);
      expect(getByText("Modifier un ingrédient frigo :")).toBeInTheDocument();
      expect(
        queryByText("Ajouter un ingrédient frigo :")
      ).not.toBeInTheDocument();
      expect(getByText("Modifier")).toBeInTheDocument();
      expect(queryByText("Ajouter")).not.toBeInTheDocument();
      const ingredientName = getByDisplayValue("Epinards");
      expect(ingredientName).toBeInTheDocument();
      expect(ingredientName).toHaveFocus();
      expect(getByDisplayValue("60")).toBeInTheDocument();
      expect(getByDisplayValue("g")).toBeInTheDocument();
      expect(getByDisplayValue(/2100/)).toBeInTheDocument();
    });
  });

  it(`provides the right proposals when a letter is entered in the input of the ingredient name`, async () => {
    const { getByLabelText, getAllByTestId } = await renderIngredients();
    const inputIngredientName = getByLabelText("Nom de l'ingrédient :");
    fireEvent.change(inputIngredientName, { target: { value: "f" } });
    const options = getAllByTestId("suggestions");
    let fraises = options[0];
    let framboises = options[1];
    expect(options).toHaveLength(2);
    expect(fraises.value).toEqual("Fraises");
    expect(framboises.value).toEqual("Framboises");
  });
});
