import React from "react";
import { render, fireEvent, act, within } from "@testing-library/react";
import RecettesAffichage from "./RecettesAffichage";

require("mutationobserver-shim");

let recettes;

beforeEach(() => {
  recettes = [
    {
      id: 1,
      categories: ["Plat", "Entrée"],
      titre: "Salade de pommes de terre radis",
      ingredients: [
        { ingredient: "pommes de terre", quantite: "1", unite: "kg" },
        { ingredient: "oeufs", quantite: "3", unite: "pièce(s)" },
        { ingredient: "vinaigre non balsamique", quantite: "1", unite: "cas" },
        { ingredient: "radis", quantite: "2", unite: "botte(s)" },
        { ingredient: "oignons bottes", quantite: "2", unite: "pièce(s)" },
        { ingredient: "yaourt grec", quantite: "1", unite: "pièce(s)" },
        { ingredient: "mayonnaise", quantite: "1", unite: "cas" },
        { ingredient: "moutarde", quantite: "0.5", unite: "cas" },
        { ingredient: "ail", quantite: "1", unite: "gousse(s)" },
      ],
      duree: "35 min",
      description:
        "Epluchez et coupez les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Coupez les radis en rondelles. Emincez les échalottes et les oignons. Coupez les oeufs durs. Mettre le tout dans un saladier et rajoutez le vinaigre. Mélangez. Préparez la sauce :  mélangez le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner. Une recette en or ...",
    },

    {
      id: 2,
      categories: ["Entrée"],
      titre: "Marinade de saumon fumé",
      ingredients: [
        { ingredient: "saumon fumé", quantite: "200", unite: "g" },
        { ingredient: "citon vert", quantite: "0,5", unite: "pièce(s)" },
        { ingredient: "vinaigre balsamique", quantite: "2", unite: "cas" },
        { ingredient: "huile d'olive", quantite: "2", unite: "cas" },
        { ingredient: "échalotte", quantite: "1", unite: "pièce(s)" },
        { ingredient: "herbes fraiches", quantite: "1", unite: "cas" },
      ],
      duree: "11 h",
      description:
        "Emincez le saumon, l'échalotte et le persil. Ajoutez le vinaigre, l'huile, le citron et un peu de poivre. Mélangez et laissez mariner toute la nuit.",
    },

    {
      id: 3,
      categories: ["Dessert"],
      titre: "Crumble aux poires",
      ingredients: [
        { ingredient: "poires", quantite: "1", unite: "kg" },
        { ingredient: "farine", quantite: "150", unite: "g" },
        { ingredient: "beurre", quantite: "130", unite: "g" },
        { ingredient: "cassonade", quantite: "120", unite: "g" },
      ],
      duree: "1 h",
      description:
        "Épluchez et épépinez les poires. Coupez-les en dés. Faites-les revenir 10 min dans 40 g de beurre et 40 g de cassonade. Préchauffez le four à 210 °C. Mélangez la farine avec le reste de cassonade, 80 g de beurre mou en dés et 1 pincée de sel afin d'obtenir une pâte sableuse. Disposez les poires dans un plat à gratin beurré. Parsemez de pâte en l'effritant du bout des doigts. Enfournez 30 min. Servez chaud ou tiède.",
    },
  ];
});

it("renders title element of all the recipes", () => {
  const { getByText } = render(<RecettesAffichage recettes={recettes} />);
  const titreRecette1 = getByText("Salade de pommes de terre radis");
  const titreRecette2 = getByText("Marinade de saumon fumé");
  const titreRecette3 = getByText("Crumble aux poires");
  expect(titreRecette1).toBeInTheDocument();
  expect(titreRecette2).toBeInTheDocument();
  expect(titreRecette3).toBeInTheDocument();
});

describe("the category filtration functionality works properly", () => {
  it("renders only the categories present in the possible recipes", () => {
    const { getByText, rerender } = render(
      <RecettesAffichage recettes={recettes} />
    );
    const plat = getByText("Plat");
    const entrée = getByText("Entrée");
    const dessert = getByText("Dessert");
    expect(plat).toBeInTheDocument();
    expect(entrée).toBeInTheDocument();
    expect(dessert).toBeInTheDocument();
    recettes.splice(0, 1);
    rerender(<RecettesAffichage recettes={recettes} />);
    expect(plat).not.toBeInTheDocument();
    expect(entrée).toBeInTheDocument();
    expect(dessert).toBeInTheDocument();
  });

  it("renders the right numbers of each possible categories", () => {
    const { getByText } = render(<RecettesAffichage recettes={recettes} />);
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
      <RecettesAffichage recettes={recettes} />
    );
    const plat = getByLabelText("Plat");
    fireEvent.click(plat);
    const titreRecette1 = getByText("Salade de pommes de terre radis");
    const titreRecette2 = queryByText("Marinade de saumon fumé");
    const titreRecette3 = queryByText("Crumble aux poires");
    expect(titreRecette1).toBeInTheDocument();
    expect(titreRecette2).not.toBeInTheDocument();
    expect(titreRecette3).not.toBeInTheDocument();
  });

  it("renders only the recipes with the two categories selected", () => {
    const { getByText, getByLabelText, queryByText } = render(
      <RecettesAffichage recettes={recettes} />
    );
    const plat = getByLabelText("Plat");
    const dessert = getByLabelText("Dessert");
    fireEvent.click(plat);
    fireEvent.click(dessert);
    const titreRecette1 = getByText("Salade de pommes de terre radis");
    const titreRecette2 = queryByText("Marinade de saumon fumé");
    const titreRecette3 = getByText("Crumble aux poires");
    expect(titreRecette1).toBeInTheDocument();
    expect(titreRecette2).not.toBeInTheDocument();
    expect(titreRecette3).toBeInTheDocument();
  });

  it("checks categorie checkboxes when it's clicked", () => {
    const { getByLabelText } = render(
      <RecettesAffichage recettes={recettes} />
    );
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
    } = render(<RecettesAffichage recettes={recettes} />);
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
    } = render(<RecettesAffichage recettes={recettes} />);
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
    } = render(<RecettesAffichage recettes={recettes} />);
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
    } = render(<RecettesAffichage recettes={recettes} />);
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
      <RecettesAffichage recettes={recettes} />
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
    } = render(<RecettesAffichage recettes={recettes} />);
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
    } = render(<RecettesAffichage recettes={recettes} />);
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
    } = render(<RecettesAffichage recettes={recettes} />);
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
