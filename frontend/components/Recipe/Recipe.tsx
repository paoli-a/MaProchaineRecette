import React from "react";
import { CatalogRecipe, FridgeRecipe } from "../../constants/types";
import IngredientsList from "./IngredientsList";
import styles from "./Recipe.module.scss";

type RecipeProps<T> = {
  recipe: T;
  /**
   * Permet de faire apparaître un bouton à côté du titre d'une recette.
   */
  optionalButton?: JSX.Element;
  /**
   * Permet d'afficher les erreurs concernant la consommation.
   */
  error?: string;
  /**
   * Permet de faire en sorte que seul le titre des recettes soit affiché et de
   faire apparaître la totalité de la recette quand on clique sur ce titre.
   */
  activateClick?: boolean;
  /**
   * La prop highlight est une fonction qui permet de modifier le titre ou la
   * description de chaque recette en mettant en valeur une partie ou la totalité
   * du texte, par exemple avec des balises mark. Par défaut, la fonction garde
   * le texte original. Cette prop est transmise à IngredientsList.
   */
  highlight?: (texte: string) => JSX.Element | string;
};

/**
 * Ce composant permet d'afficher une recette.
 *
 * De manière optionnelle on peut faire en sorte :
 * - d'afficher un bouton à côté du titre d'une recette, par exemple pour pouvoir la supprimer
 * - de n'afficher que le titre et de faire apparaître la totalité de la recette quand on clique sur ce titre.
 *
 * @component
 */
function Recipe<T extends CatalogRecipe | FridgeRecipe>({
  recipe,
  optionalButton,
  error,
  activateClick,
  highlight = (texte) => texte,
}: RecipeProps<T>) {
  const title = () => {
    if (activateClick) {
      return <h2 className={styles.title}> {highlight(recipe.title)}</h2>;
    } else {
      return <h2 className={styles.title}> {highlight(recipe.title)}</h2>;
    }
  };
  const isRecipeUnsure = Boolean(
    "unsure_ingredients" in recipe &&
      recipe.unsure_ingredients &&
      recipe.unsure_ingredients.length !== 0
  );

  return (
    <article
      className={`${styles.recipe} ${isRecipeUnsure ? styles.unsure : ""}`}
    >
      {error}
      <div className={styles.header}>
        {title()}
        {!isRecipeUnsure && optionalButton}
      </div>
      <div className={styles.contentWrapper}>
        <IngredientsList
          ingredients={recipe.ingredients}
          priorityIngredients={
            "unsure_ingredients" in recipe
              ? recipe.priority_ingredients
              : undefined
          }
          unsureIngredients={
            "unsure_ingredients" in recipe
              ? recipe.unsure_ingredients
              : undefined
          }
          highlight={highlight}
        />
        <p className={styles.recipeDescription}>
          {highlight(recipe.description)}
        </p>
      </div>
    </article>
  );
}

export default Recipe;
