import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MaProchaineRecette from "./MaProchaineRecette";
import * as serviceWorker from "./serviceWorker";

const recettes = [
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
    categories: ["Plat"],
    titre: "Gratin pommes de terre panais",
    ingredients: [
      { ingredient: "pommes de terre", quantite: "1", unite: "kg" },
      { ingredient: "panais", quantite: "4", unite: "pièce(s)" },
      { ingredient: "crème fraiche épaisse", quantite: "20", unite: "cl" },
      { ingredient: "crème fraiche semi-épaisse", quantite: "10", unite: "cl" },
      { ingredient: "moutarde", quantite: "1.5", unite: "cas" },
      { ingredient: "gruillère rapé", quantite: "70", unite: "g" },
    ],
    duree: "1h",
    description:
      "Eplucher et couper les patates en rondelles et les cuire à l'eau. Eplucher et couper las panais en rondelles et les cuire à la vapeur. Préparer la sauce : dans une casserole à feu doux mélanger les deux crèmes puis ajouter la moutarde et assaisoner. Répartir les panais et les pommes de terre dans un plat, recouvrir de sauce puis de gruillère rapé. Faire gratiner au four.",
  },
];

const ingredientsFrigo = [
  {
    id: 1,
    nom: "Epinard",
    datePeremption: new Date(2020, 4, 15),
    quantite: "60g",
  },
  {
    id: 2,
    nom: "Céleri rave",
    datePeremption: new Date(2020, 3, 13),
    quantite: "1kg",
  },
];

ReactDOM.render(
  <MaProchaineRecette
    recettes={recettes}
    ingredientsFrigo={ingredientsFrigo}
  />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
