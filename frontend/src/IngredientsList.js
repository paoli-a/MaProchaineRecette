import React from "react";
import PropTypes from "prop-types";

function IngredientsList({
  ingredients,
  priorityIngredients,
  unsureIngredients,
  highlight,
}) {
  const renderName = (ingredient) => {
    if (priorityIngredients.includes(ingredient)) {
      return <strong data-testid="strong-tag">{highlight(ingredient)}</strong>;
    } else {
      return highlight(ingredient);
    }
  };

  const ingredientsList = [];
  for (let { ingredient, quantite, unite } of ingredients) {
    ingredientsList.push(
      <li key={ingredient}>
        {renderName(ingredient)} : {quantite} {unite}
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
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      ingredient: PropTypes.string.isRequired,
      quantite: PropTypes.string.isRequired,
      unite: PropTypes.string.isRequired,
    }).isRequired
  ),
  /**
   * Il s'agit ici des ingrédients les plus urgents en terme de date de
   * péremption.
   */
  priorityIngredients: PropTypes.arrayOf(PropTypes.string),
  /**
   * Il s'agit ici des ingrédients qui sont présents dans le frigo
   * mais dont la quantité ne peut pas être vérifiée conforme pour
   * la recette.
   */
  unsureIngredients: PropTypes.arrayOf(PropTypes.string),
  /**
   * La prop highlight est une fonction qui permet de modifier le nom de chaque
   * ingrédient en mettant en valeur une partie ou la totalité de ce nom, par
   * exemple avec des balises mark. Par défaut, la fonction garde le texte original.
   */
  highlight: PropTypes.func,
};

IngredientsList.defaultProps = {
  highlight: (texte) => texte,
  priorityIngredients: [],
  unsureIngredients: [],
};

export default IngredientsList;
