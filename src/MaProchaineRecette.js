import React from 'react';
import RecettesAffichage from "./RecettesAffichage"
import IngredientsFrigo from "./IngredientsFrigo"

function MaProchaineRecette ({recettes, ingredientsFrigo}) {

  return (
    <div>
      <span>
        <RecettesAffichage recettes={recettes}/>
      </span>
      <span>
        <IngredientsFrigo ingredients={ingredientsFrigo}/>
      </span>
    </div>
  )
}

export default MaProchaineRecette;
