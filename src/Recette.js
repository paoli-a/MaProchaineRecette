import React from 'react';
import IngredientsList from "./IngredientsList"
import './Recette.css';

function Recette({recette, optionalButton}) {



  return (
    <article className="Recette">
      <h2>{recette.titre} {optionalButton}</h2>
      <IngredientsList ingredients={recette.ingredients} />
      <p>{recette.description}</p>
    </article>
 );
}

export default Recette;
