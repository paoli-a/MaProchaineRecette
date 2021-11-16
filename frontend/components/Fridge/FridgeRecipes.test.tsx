/* eslint-disable testing-library/no-await-sync-query */
import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";
import { SWRConfig } from "swr";
import { axiosGetGlobalMock, GetByType, mockedAxios } from "../testUtils";
import FridgeRecipes from "./FridgeRecipes";

beforeEach(() => {
  axiosGetGlobalMock();
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderFridgeRecipes = async (): Promise<RenderResult> => {
  let app = render(<></>);
  await act(async () => {
    app = render(
      <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
        <FridgeRecipes />
      </SWRConfig>
    );
  });
  return app;
};

describe("Renders correctly each recipe", () => {
  it("renders title element of all the recipes", async () => {
    const { getByText } = await renderFridgeRecipes();
    const recipeTitle1 = getByText("Salade de pommes de terre radis");
    const recipeTitle2 = getByText("Marinade de saumon fumé");
    const recipeTitle3 = getByText("Crumble aux poires");
    expect(recipeTitle1).toBeInTheDocument();
    expect(recipeTitle2).toBeInTheDocument();
    expect(recipeTitle3).toBeInTheDocument();
  });
});

describe("the category filtration functionality works properly", () => {
  it("renders only the categories present in the possible recipes", async () => {
    const { getByText } = await renderFridgeRecipes();
    const plat = getByText("Plat");
    const entrée = getByText("Entrée");
    const dessert = getByText("Dessert");
    expect(plat).toBeInTheDocument();
    expect(entrée).toBeInTheDocument();
    expect(dessert).toBeInTheDocument();
  });

  it("renders the right numbers of each possible categories", async () => {
    const { getByText } = await renderFridgeRecipes();
    const plat = getByText("Plat");
    const entree = getByText("Entrée");
    const dessert = getByText("Dessert");
    const nombrePlat = within(plat).getByText("1");
    const nombreEntree = within(entree).getByText("2");
    const nombreDessert = within(dessert).getByText("1");
    expect(nombrePlat.textContent).toEqual("1");
    expect(nombreEntree.textContent).toEqual("2");
    expect(nombreDessert.textContent).toEqual("1");
  });

  it("renders only the recipes with the category selected", async () => {
    const {
      getByText,
      getByLabelText,
      queryByText,
    } = await renderFridgeRecipes();
    const plat = getByLabelText("Plat");
    fireEvent.click(plat);
    const recipeTitle1 = getByText("Salade de pommes de terre radis");
    const recipeTitle2 = queryByText("Marinade de saumon fumé");
    const recipeTitle3 = queryByText("Crumble aux poires");
    expect(recipeTitle1).toBeInTheDocument();
    expect(recipeTitle2).not.toBeInTheDocument();
    expect(recipeTitle3).not.toBeInTheDocument();
  });

  it("renders only the recipes with the two categories selected", async () => {
    const {
      getByText,
      getByLabelText,
      queryByText,
    } = await renderFridgeRecipes();
    const plat = getByLabelText("Plat");
    const dessert = getByLabelText("Dessert");
    fireEvent.click(plat);
    fireEvent.click(dessert);
    const recipeTitle1 = getByText("Salade de pommes de terre radis");
    const recipeTitle2 = queryByText("Marinade de saumon fumé");
    const recipeTitle3 = getByText("Crumble aux poires");
    expect(recipeTitle1).toBeInTheDocument();
    expect(recipeTitle2).not.toBeInTheDocument();
    expect(recipeTitle3).toBeInTheDocument();
  });

  it("checks category checkboxes when it's clicked", async () => {
    const { getByLabelText } = await renderFridgeRecipes();
    const entree = getByLabelText("Entrée") as HTMLInputElement;
    const dessert = getByLabelText("Dessert") as HTMLInputElement;
    expect(entree.checked).toEqual(false);
    fireEvent.click(entree);
    expect(entree.checked).toEqual(true);
    expect(dessert.checked).toEqual(false);
    fireEvent.click(dessert);
    expect(dessert.checked).toEqual(true);
  });
});

describe("the search filtration functionality works properly", () => {
  async function makeASearch(
    wantedValue: string,
    getByPlaceholderText: GetByType,
    getByTestId: GetByType
  ) {
    const searchBar = getByPlaceholderText("Recherche...");
    const submitButton = getByTestId("search-button");
    fireEvent.change(searchBar, { target: { value: wantedValue } });
    await act(async () => {
      fireEvent.click(submitButton);
    });
  }

  const getContent = (text: string) => {
    /* This function finds only text between tags, but it does not
    find the text when it's not cut by tags.*/
    return (content: string, element: Element | null) =>
      Boolean(element?.textContent === text);
  };

  it("renders only the recipes containing the searched word in their titles", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByTestId,
      queryByText,
    } = await renderFridgeRecipes();
    await makeASearch("salade", getByPlaceholderText, getByTestId);
    expect(
      getByText(getContent("Salade de pommes de terre radis"))
    ).toBeInTheDocument();
    expect(queryByText("Marinade de saumon fumé")).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Marinade de saumon fumé"))
    ).not.toBeInTheDocument();
    expect(queryByText("Crumble aux poires")).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Crumble aux poires"))
    ).not.toBeInTheDocument();
  });

  it("renders only the recipes containing the searched word in their descriptions", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByTestId,
      queryByText,
    } = await renderFridgeRecipes();
    await makeASearch("épépinez", getByPlaceholderText, getByTestId);
    expect(getByText("Crumble aux poires")).toBeInTheDocument();
    expect(
      queryByText("Salade de pommes de terre radis")
    ).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Salade de pommes de terre radis"))
    ).not.toBeInTheDocument();
    expect(queryByText("Marinade de saumon fumé")).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Marinade de saumon fumé"))
    ).not.toBeInTheDocument();
  });

  it("renders only the recipes containing the searched word in their ingredients list", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByTestId,
      queryByText,
    } = await renderFridgeRecipes();
    await makeASearch("Vert", getByPlaceholderText, getByTestId);
    expect(getByText("Marinade de saumon fumé")).toBeInTheDocument();
    expect(queryByText("Crumble aux poires")).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Crumble aux poires"))
    ).not.toBeInTheDocument();
    expect(
      queryByText("Salade de pommes de terre radis")
    ).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Salade de pommes de terre radis"))
    ).not.toBeInTheDocument();
  });

  it(`renders only the recipes containing the searched words, except for words
    smaller than 2 characters`, async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByTestId,
      queryByText,
    } = await renderFridgeRecipes();
    await makeASearch("Marinade y", getByPlaceholderText, getByTestId);
    expect(
      getByText(getContent("Marinade de saumon fumé"))
    ).toBeInTheDocument();
    // there is no "y" in the first recipe, but there is y in this one
    expect(
      queryByText("Salade de pommes de terre radis")
    ).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Salade de pommes de terre radis"))
    ).not.toBeInTheDocument();
  });

  it(`renders only the recipes containing the searched words, for words of
    2 characters`, async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByTestId,
    } = await renderFridgeRecipes();
    await makeASearch("Marinade or", getByPlaceholderText, getByTestId);
    expect(
      getByText(getContent("Marinade de saumon fumé"))
    ).toBeInTheDocument();
    expect(getByText("Salade de pommes de terre radis")).toBeInTheDocument();
  });

  it(`renders only the recipes containing the searched words, except for
    stopwords`, async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByTestId,
      queryByText,
    } = await renderFridgeRecipes();
    await makeASearch(
      "Marinade les de et la l",
      getByPlaceholderText,
      getByTestId
    );
    expect(
      getByText(getContent("Marinade de saumon fumé"))
    ).toBeInTheDocument();
    expect(
      queryByText("Salade de pommes de terre radis")
    ).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Salade de pommes de terre radis"))
    ).not.toBeInTheDocument();
  });

  it(`renders only the recipes containing the searched words, except for
    punctuation`, async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByTestId,
      queryByText,
    } = await renderFridgeRecipes();
    await makeASearch("'Marinade. , ! ...", getByPlaceholderText, getByTestId);
    expect(
      getByText(getContent("Marinade de saumon fumé"))
    ).toBeInTheDocument();
    expect(
      queryByText("Salade de pommes de terre radis")
    ).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Salade de pommes de terre radis"))
    ).not.toBeInTheDocument();
  });

  it("renders all the recipes containing any of the searched words", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByTestId,
      queryByText,
    } = await renderFridgeRecipes();
    await makeASearch("Marinade crumble", getByPlaceholderText, getByTestId);
    expect(
      getByText(getContent("Marinade de saumon fumé"))
    ).toBeInTheDocument();
    expect(getByText(getContent("Crumble aux poires"))).toBeInTheDocument();
    expect(
      queryByText("Salade de pommes de terre radis")
    ).not.toBeInTheDocument();
    expect(
      queryByText(getContent("Salade de pommes de terre radis"))
    ).not.toBeInTheDocument();
  });
});

describe("Consuming functionnality", () => {
  it(`displays an error message when clicking on the consume button if the
  modification was not successful on backend side`, async () => {
    const { getAllByText, getByText } = await renderFridgeRecipes();
    mockedAxios.post.mockRejectedValue({});
    const consumeButton = getAllByText("Consommer la recette")[0];
    fireEvent.click(consumeButton);
    await waitFor(() =>
      expect(
        getByText(
          "La recette n'a pas pu être consommée, veuillez réessayer plus tard"
        )
      ).toBeInTheDocument()
    );
  });
});
