import React from 'react';
import IngredientsList from "./IngredientsList"

function Recette({recette}) {


  return (
    <article>
      <h2>{recette.titre}</h2>
      <IngredientsList ingredients={recette.ingredients} />
      <p>{recette.description}</p>
    </article>
 );
}

export default Recette;
