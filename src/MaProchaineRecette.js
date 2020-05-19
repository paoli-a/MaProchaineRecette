import React from "react";
import RecettesAffichage from "./RecettesAffichage";
import IngredientsFrigo from "./IngredientsFrigo";
import IngredientsCatalogue from "./IngredientsCatalogue";
import RecettesCatalogue from "./RecettesCatalogue";

function MaProchaineRecette({
  recettes,
  ingredientsFrigo,
  ingredientsCatalogue,
}) {
  return (
    <div>
      <IngredientsCatalogue ingredientsPossibles={ingredientsCatalogue} />
      <RecettesCatalogue totalRecettes={recettes} />
      <RecettesAffichage recettes={recettes} />
      <IngredientsFrigo ingredients={ingredientsFrigo} />
    </div>
  );
}

export default MaProchaineRecette;
