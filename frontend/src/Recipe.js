import React, { useState, useEffect } from "react";
import IngredientsList from "./IngredientsList";
import "./Recipe.css";
import PropTypes from "prop-types";

function Recipe({ recipe, optionalButton, activateClick, highlight }) {
  const [isRecipeOpen, setRecipeOpen] = useState();

  useEffect(() => {
    if (activateClick === true) {
      setRecipeOpen(false);
    } else {
      setRecipeOpen(true);
    }
  }, [activateClick]);

  const handleTitleClick = () => {
    setRecipeOpen(!isRecipeOpen);
  };

  const title = () => {
    if (activateClick) {
      return (
        <h2 className="curseurMain" onClick={handleTitleClick}>
          {highlight(recipe.titre)} {optionalButton}
        </h2>
      );
    } else {
      return (
        <h2>
          {" "}
          {highlight(recipe.titre)} {optionalButton}
        </h2>
      );
    }
  };
  const isRecipeUnsure = Boolean(
    recipe.unsure_ingredients && recipe.unsure_ingredients.length !== 0
  );

  return (
    <article className={isRecipeUnsure ? "Recipe unsure" : "Recipe"}>
      {title()}
      <div className={isRecipeOpen ? null : "hidden"}>
        <IngredientsList
          ingredients={recipe.ingredients}
          priorityIngredients={recipe.priority_ingredients}
          unsureIngredients={recipe.unsure_ingredients}
          highlight={highlight}
        />
        <p>{highlight(recipe.description)}</p>
      </div>
    </article>
  );
}

Recipe.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    titre: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        ingredient: PropTypes.string.isRequired,
        amount: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
      }).isRequired
    ),
    duree: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  /**
   * Permet de faire apparaître un bouton à côté du titre d'une recette.
   */
  optionalButton: PropTypes.element,
  /**
   * Permet de faire en sorte que seul le titre des recettes soit affiché et de
   faire apparaître la totalité de la recette quand on clique sur ce titre.
   */
  activateClick: PropTypes.bool,
  /**
   * La prop highlight est une fonction qui permet de modifier le titre ou la
   * description de chaque recette en mettant en valeur une partie ou la totalité
   * du texte, par exemple avec des balises mark. Par défaut, la fonction garde
   * le texte original. Cette prop est transmise à IngredientsList.
   */
  highlight: PropTypes.func,
};

Recipe.defaultProps = {
  highlight: (texte) => texte,
};

export default Recipe;
