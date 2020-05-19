import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MaProchaineRecette from './MaProchaineRecette';
import * as serviceWorker from './serviceWorker';

const recettes = [
  {
    id : "001",
    categorie : ["Plat", "Entrée"],
    titre : "Salade de pommes de terre radis",
    ingredients : {"pommes de terre" : "1 kg", "oeufs" : "3", "vinaigre non balsamique" : "1 cas", "radis": "2 bottes", "oignons bottes" : "2 cas", "yaourt grec" : "1", "mayonnaise" : "1 cas", "moutarde" : "1/2 cas", "ail" : "1 gousse"},
    temps : "35 min",
    description : "Eplucher et couper les patates en rondelles et les cuire à l'eau. Cuire les oeufs durs. Couper les radis en rondelles. Emincer les échalottes et les oignons. Couper les oeufs durs. Mettre le tout dans un saladier et rajouter le vinaigre. Mélanger. Préparer la sauce :  mélanger le yaourt, la mayonnaise, la moutarde, la gousse d'ail rapée. Assaisoner.",
  },

  {
    id : "002",
    categorie : ["Plat"],
    titre : "Gratin pommes de terre panais",
    ingredients : {"pommes de terre" : "1 kg", "panais" : "4", "crème fraiche épaisse": "20 cl", "crème fraiche semi-épaisse" : "10 cl", "moutarde" : "1,5 cas", "gruillère rapé" : "70 g"},
    temps : "1 h",
    description : "Eplucher et couper les patates en rondelles et les cuire à l'eau. Eplucher et couper las panais en rondelles et les cuire à la vapeur. Préparer la sauce : dans une casserole à feu doux mélanger les deux crèmes puis ajouter la moutarde et assaisoner. Répartir les panais et les pommes de terre dans un plat, recouvrir de sauce puis de gruillère rapé. Faire gratiner au four."
  }
]

const ingredientsFrigo = [
  {
    id : 1,
    nom : "Epinard",
    datePeremption : new Date(2020, 4, 15),
    quantite : "60g",
  },
  {
    id : 2,
    nom : "Céleri rave",
    datePeremption : new Date(2020, 3, 13),
    quantite : "1kg",
  }
]

const ingredientsCatalogue = [
  {
    id : 10,
    nom : "Fraises",
  },
  {
    id : 11,
    nom : "Sucre",
  }
]

ReactDOM.render(
  <MaProchaineRecette
    recettes={recettes}
    ingredientsFrigo={ingredientsFrigo}
    ingredientsCatalogue={ingredientsCatalogue}
  />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
