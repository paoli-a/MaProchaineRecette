
import React from 'react';


function IngredientsList({ingredients}) {

  const ingredientsList = []
  for (let [key, value] of Object.entries(ingredients)) {
    ingredientsList.push(<li>{key} : {value}</li>)
  }

  return (
    <ul>
      {ingredientsList}
    </ul>
  );
}

export default IngredientsList;
