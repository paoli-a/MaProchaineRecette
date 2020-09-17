import React from "react";
import { render } from "@testing-library/react";
import Recette from "./Recette";

let recette;

beforeEach(() => {
  recette = {
    id: 1,
    categories: ["Plat"],
    titre: "Salade de pommes de terre radis",
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
    duree: "35 min",
    description:
      "Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Couper les radis en rondelles. Emincer les échalottes et les oignons. Couper les oeufs durs. Mettre le tout dans un saladier et rajouter le vinaigre. Mélanger. Préparer la sauce :  mélanger le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
    priority_ingredients: ["oeufs"],
    unsure_ingredients: ["ail"],
  };
});

it("renders title element on the document", () => {
  const { getByText } = render(<Recette recette={recette} />);
  const titreRecette = getByText("Salade de pommes de terre radis");
  expect(titreRecette).toBeInTheDocument();
});

it("renders description element on the document", () => {
  const { getByText } = render(<Recette recette={recette} />);
  const descriptionRecette = getByText(
    "Eplucher et couper les patates en rondelles et les cuire à l'eau.",
    { exact: false }
  );
  expect(descriptionRecette).toBeInTheDocument();
});
