import React from "react";

type IngredientsListProps = {
  /**
   * Il s'agit ici de la liste d'ingredients nécessaires avec leur quantité
   * recquise pour une recette donnée.
   */
  ingredients: { ingredient: string; amount: string; unit: string }[];

  /**
   * Il s'agit ici des ingrédients les plus urgents en terme de date de
   * péremption.
   */
  priorityIngredients?: string[];
  /**
   * Il s'agit ici des ingrédients qui sont présents dans le frigo
   * mais dont la quantité ne peut pas être vérifiée conforme pour
   * la recette.
   */
  unsureIngredients?: string[];
  /**
   * La prop highlight est une fonction qui permet de modifier le nom de chaque
   * ingrédient en mettant en valeur une partie ou la totalité de ce nom, par
   * exemple avec des balises mark. Par défaut, la fonction garde le texte original.
   */
  highlight?: (texte: string) => JSX.Element | string;
};

/**
 * Ce composant permet d'afficher la liste des ingrédients nécessaires avec leur
 * quantité correspondante pour une recette donnée.
 *
 * @component
 */
function IngredientsList({
  ingredients,
  priorityIngredients = [],
  unsureIngredients = [],
  highlight = (texte) => texte,
}: IngredientsListProps): JSX.Element {
  const renderName = (ingredient) => {
    const isIngredientPriority = priorityIngredients.includes(ingredient);
    if (isIngredientPriority) {
      return <strong data-testid="strong-tag">{highlight(ingredient)}</strong>;
    } else {
      return highlight(ingredient);
    }
  };

  const renderIngredient = (ingredient, amount, unit) => {
    const isIngredientUnsure = unsureIngredients.includes(ingredient);
    if (isIngredientUnsure) {
      return (
        <em
          title="Il n'y a peut-être pas la bonne quantité de cet ingredient"
          className="unsure-ingredient"
        >
          {renderName(ingredient)} : {amount} {unit}
        </em>
      );
    } else {
      return (
        <React.Fragment>
          {renderName(ingredient)} : {amount} {unit}
        </React.Fragment>
      );
    }
  };

  const ingredientsList = [];
  for (let { ingredient, amount, unit } of ingredients) {
    ingredientsList.push(
      <li key={ingredient}>{renderIngredient(ingredient, amount, unit)}</li>
    );
  }

  return <ul className="Recipe__ingredients-container">{ingredientsList}</ul>;
}

export default IngredientsList;
