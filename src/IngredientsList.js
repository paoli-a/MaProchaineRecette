
import React from 'react';


function IngredientsList({ingredients}) {

  const ingredientsList = []
  for (let [ingredientName, amount] of Object.entries(ingredients)) {
    ingredientsList.push(
      <li key={ingredientName}>{ingredientName} : {amount}</li>
    )
  }

  return (
    <ul>
      {ingredientsList}
    </ul>
  );
}

export default IngredientsList;
