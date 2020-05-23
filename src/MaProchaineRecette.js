import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Ma prochaine recette</Link>
            </li>
            <li>
              <Link to="/recettes">Catalogue des recettes</Link>
            </li>
            <li>
              <Link to="/ingredients">Catalogue des ingrédients</Link>
            </li>
          </ul>
        </nav>
        <Route path="/recettes">
          <RecettesCatalogue
            totalRecettes={recettes}
            ingredientsPossibles={ingredientsUpdated}
          />
        </Route>
        <Route path="/ingredients">
          <IngredientsCatalogue
            ingredientsPossibles={ingredientsUpdated}
            updateIngredientsPossibles={handleIngredientsPossibles}
          />
        </Route>
        <Route path="/" exact>
          <RecettesAffichage recettes={recettes} />
          <IngredientsFrigo
            ingredients={ingredientsFrigo}
            ingredientsPossibles={ingredientsUpdated}
          />
        </Route>
      </div>
    </Router>
  );
}

export default MaProchaineRecette;
