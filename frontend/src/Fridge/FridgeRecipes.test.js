import React from "react";
import { render, fireEvent, act, within } from "@testing-library/react";
import FridgeRecipes from "./FridgeRecipes";

require("mutationobserver-shim");

let recipes;

beforeEach(() => {
  recipes = [
    {
      id: 1,
      categories: ["Plat", "Entrée"],
      title: "Salade de pommes de terre radis",
      ingredients: [
        { ingredient: "pommes de terre", amount: "1", unit: "kg" },
        { ingredient: "oeufs", amount: "3", unit: "pièce(s)" },
        { ingredient: "vinaigre non balsamique", amount: "1", unit: "cas" },
        { ingredient: "radis", amount: "2", unit: "botte(s)" },
        { ingredient: "oignons bottes", amount: "2", unit: "pièce(s)" },
        { ingredient: "yaourt grec", amount: "1", unit: "pièce(s)" },
        { ingredient: "mayonnaise", amount: "1", unit: "cas" },
        { ingredient: "moutarde", amount: "0.5", unit: "cas" },
        { ingredient: "ail", amount: "1", unit: "gousse(s)" },
      ],
      duration: "35 min",
      description:
        "Epluchez et coupez les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Coupez les radis en rondelles. Emincez les échalottes et les oignons. Coupez les oeufs durs. Mettre le tout dans un saladier et rajoutez le vinaigre. Mélangez. Préparez la sauce :  mélangez le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner. Une recette en or ...",
      priority_ingredients: ["oeufs"],
      unsure_ingredients: ["ail"],
    },
    {
      id: 2,
      categories: ["Entrée"],
      title: "Marinade de saumon fumé",
      ingredients: [
        { ingredient: "saumon fumé", amount: "200", unit: "g" },
        { ingredient: "citon vert", amount: "0,5", unit: "pièce(s)" },
        { ingredient: "vinaigre balsamique", amount: "2", unit: "cas" },
        { ingredient: "huile d'olive", amount: "2", unit: "cas" },
        { ingredient: "échalotte", amount: "1", unit: "pièce(s)" },
        { ingredient: "herbes fraiches", amount: "1", unit: "cas" },
      ],
      duration: "11 h",
      description:
        "Emincez le saumon, l'échalotte et le persil. Ajoutez le vinaigre, l'huile, le citron et un peu de poivre. Mélangez et laissez mariner toute la nuit.",
      priority_ingredients: ["herbes raiches"],
      unsure_ingredients: [],
    },
    {
      id: 3,
      categories: ["Dessert"],
      title: "Crumble aux poires",
      ingredients: [
        { ingredient: "poires", amount: "1", unit: "kg" },
        { ingredient: "farine", amount: "150", unit: "g" },
        { ingredient: "beurre", amount: "130", unit: "g" },
        { ingredient: "cassonade", amount: "120", unit: "g" },
      ],
      duration: "1 h",
      description:
        "Épluchez et épépinez les poires. Coupez-les en dés. Faites-les revenir 10 min dans 40 g de beurre et 40 g de cassonade. Préchauffez le four à 210 °C. Mélangez la farine avec le reste de cassonade, 80 g de beurre mou en dés et 1 pincée de sel afin d'obtenir une pâte sableuse. Disposez les poires dans un plat à gratin beurré. Parsemez de pâte en l'effritant du bout des doigts. Enfournez 30 min. Servez chaud ou tiède.",
      priority_ingredients: ["poires"],
      unsure_ingredients: [],
    },
  ];
});

describe("Renders correctly each recipe", () => {
  it("renders title element of all the recipes", () => {
    const { getByText } = render(<FridgeRecipes recipes={recipes} />);
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
    const { getByText, rerender } = render(<FridgeRecipes recipes={recipes} />);
    const plat = getByText("Plat");
    const entrée = getByText("Entrée");
    const dessert = getByText("Dessert");
    expect(plat).toBeInTheDocument();
    expect(entrée).toBeInTheDocument();
    expect(dessert).toBeInTheDocument();
    recipes.splice(0, 1);
    await act(async () => {
      rerender(<FridgeRecipes recipes={recipes} />);
    });
    expect(plat).not.toBeInTheDocument();
    expect(entrée).toBeInTheDocument();
    expect(dessert).toBeInTheDocument();
  });

  it("renders the right numbers of each possible categories", () => {
    const { getByText } = render(<FridgeRecipes recipes={recipes} />);
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

  it("renders only the recipes with the category selected", () => {
    const { getByText, getByLabelText, queryByText } = render(
      <FridgeRecipes recipes={recipes} />
    );
    const plat = getByLabelText("Plat");
    fireEvent.click(plat);
    const recipeTitle1 = getByText("Salade de pommes de terre radis");
    const recipeTitle2 = queryByText("Marinade de saumon fumé");
    const recipeTitle3 = queryByText("Crumble aux poires");
    expect(recipeTitle1).toBeInTheDocument();
    expect(recipeTitle2).not.toBeInTheDocument();
    expect(recipeTitle3).not.toBeInTheDocument();
  });

  it("renders only the recipes with the two categories selected", () => {
    const { getByText, getByLabelText, queryByText } = render(
      <FridgeRecipes recipes={recipes} />
    );
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

  it("checks category checkboxes when it's clicked", () => {
    const { getByLabelText } = render(<FridgeRecipes recipes={recipes} />);
    const entree = getByLabelText("Entrée");
    const dessert = getByLabelText("Dessert");
    expect(entree.checked).toEqual(false);
    fireEvent.click(entree);
    expect(entree.checked).toEqual(true);
    expect(dessert.checked).toEqual(false);
    fireEvent.click(dessert);
    expect(dessert.checked).toEqual(true);
  });
});

describe("the search filtration functionality works properly", () => {
  async function makeASearch(wantedValue, getByPlaceholderText, getByTestId) {
    const searchBar = getByPlaceholderText("Recherche...");
    const submitButton = getByTestId("search-button");
    fireEvent.change(searchBar, { target: { value: wantedValue } });
    await act(async () => {
      fireEvent.click(submitButton);
    });
  }

  const getContent = (text) => {
    /* This function finds only text between tags, but it does not
    find the text when it's not cut by tags.*/
    return (content, node) => Boolean(node.textContent === text);
  };

  it("renders only the recipes containing the searched word in their titles", async () => {
    const {
      getByPlaceholderText,
      getByText,
      getByTestId,
      queryByText,
    } = render(<FridgeRecipes recipes={recipes} />);
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
    } = render(<FridgeRecipes recipes={recipes} />);
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
    } = render(<FridgeRecipes recipes={recipes} />);
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
    } = render(<FridgeRecipes recipes={recipes} />);
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
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <FridgeRecipes recipes={recipes} />
    );
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
    } = render(<FridgeRecipes recipes={recipes} />);
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
    } = render(<FridgeRecipes recipes={recipes} />);
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
    } = render(<FridgeRecipes recipes={recipes} />);
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
