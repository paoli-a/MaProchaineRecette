import React, { useState, useEffect } from "react";
import IngredientsList from "./IngredientsList";
import "./Recette.css";
import PropTypes from "prop-types";

function Recette({ recette, optionalButton, activateClick, highlight }) {
  const [isRecetteOpen, setRecetteOpen] = useState();

  useEffect(() => {
    if (activateClick === true) {
      setRecetteOpen(false);
    } else {
      setRecetteOpen(true);
    }
  }, [activateClick]);

  const handleTitleClick = () => {
    setRecetteOpen(!isRecetteOpen);
  };

  const title = () => {
    if (activateClick) {
      return (
        <h2 className="curseurMain" onClick={handleTitleClick}>
          {highlight(recette.titre)} {optionalButton}
        </h2>
      );
    } else {
      return (
        <h2>
          {" "}
          {highlight(recette.titre)} {optionalButton}
        </h2>
      );
    }
  };
  const isRecipeUnsure = Boolean(
    recette.unsure_ingredients && recette.unsure_ingredients.length !== 0
  );

  return (
    <article className={isRecipeUnsure ? "Recette unsure" : "Recette"}>
      {title()}
      <div className={isRecetteOpen ? null : "hidden"}>
        <IngredientsList
          ingredients={recette.ingredients}
          priorityIngredients={recette.priority_ingredients}
          unsureIngredients={recette.unsure_ingredients}
          highlight={highlight}
        />
        <p>{highlight(recette.description)}</p>
      </div>
    </article>
  );
}

Recette.propTypes = {
  recette: PropTypes.shape({
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

Recette.defaultProps = {
  highlight: (texte) => texte,
};

export default Recette;
