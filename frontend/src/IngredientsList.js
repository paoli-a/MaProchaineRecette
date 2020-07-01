import React from "react";
import PropTypes from "prop-types";

function IngredientsList({ ingredients, highlight }) {
  const ingredientsList = [];
  for (let [ingredientName, amount] of Object.entries(ingredients)) {
    ingredientsList.push(
      <li key={ingredientName}>
        {highlight(ingredientName)} : {amount}
      </li>
    );
  }

  return <ul>{ingredientsList}</ul>;
}

IngredientsList.propTypes = {
  /**
   * Il s'agit ici de la liste d'ingredients nécessaires avec leur quantité
   * recquise pour une recette donnée.
   */
  ingredients: PropTypes.objectOf(PropTypes.string).isRequired,
  /**
   * La prop highlight est une fonction qui permet de modifier le nom de chaque
   * ingrédient en mettant en valeur une partie ou la totalité de ce nom, par
   * exemple avec des balises mark. Par défaut, la fonction garde le texte original.
   */
  highlight: PropTypes.func,
};

IngredientsList.defaultProps = {
  highlight: (texte) => texte,
};

export default IngredientsList;
