import React from 'react';
import RecettesAffichage from "./RecettesAffichage"
import IngredientsFrigo from "./IngredientsFrigo"
import IngredientsCatalogue from "./IngredientsCatalogue"

function MaProchaineRecette ({recettes, ingredientsFrigo, ingredientsCatalogue}) {

  return (
    <div>
      <IngredientsCatalogue ingredientsPossibles={ingredientsCatalogue}/>
      <RecettesAffichage recettes={recettes}/>
      <IngredientsFrigo ingredients={ingredientsFrigo}/>
    </div>
  )
}

export default MaProchaineRecette;
