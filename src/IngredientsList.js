import React from "react";

IngredientsList.defaultProps = {
  highlight: (texte) => texte,
};

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

export default IngredientsList;
