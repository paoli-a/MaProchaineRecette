import React, { useState } from "react";
import RecettesAffichage from "./RecettesAffichage";
import IngredientsFrigo from "./IngredientsFrigo";
import IngredientsCatalogue from "./IngredientsCatalogue";
import RecettesCatalogue from "./RecettesCatalogue";

function MaProchaineRecette({
  recettes,
  ingredientsFrigo,
  ingredientsCatalogue,
}) {
  const [ingredientsUpdated, setIngredientsUpdated] = useState(
    ingredientsCatalogue
  );

  const handleIngredientsPossibles = (ingredients) => {
    setIngredientsUpdated(ingredients);
  };

  return (
    <div>
      <IngredientsCatalogue
        ingredientsPossibles={ingredientsUpdated}
        updateIngredientsPossibles={handleIngredientsPossibles}
      />
      <RecettesCatalogue
        totalRecettes={recettes}
        ingredientsPossibles={ingredientsUpdated}
      />
      <RecettesAffichage recettes={recettes} />
      <IngredientsFrigo
        ingredients={ingredientsFrigo}
        ingredientsPossibles={ingredientsUpdated}
      />
    </div>
  );
}

export default MaProchaineRecette;
