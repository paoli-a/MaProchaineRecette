import React, { useState } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import RecettesAffichage from "./RecettesAffichage";
import IngredientsFrigo from "./IngredientsFrigo";
import IngredientsCatalogue from "./IngredientsCatalogue";
import RecettesCatalogue from "./RecettesCatalogue";
import "./MaProchaineRecette.css";

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
              <NavLink activeClassName="currentTab" exact={true} to="/">
                Ma prochaine recette
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="currentTab" to="/recettes">
                Catalogue des recettes
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="currentTab" to="/ingredients">
                Catalogue des ingrédients
              </NavLink>
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
          <main id="MesProchainesRecettes">
            <IngredientsFrigo
              ingredients={ingredientsFrigo}
              ingredientsPossibles={ingredientsUpdated}
            />
            <RecettesAffichage recettes={recettes} />
          </main>
        </Route>
      </div>
    </Router>
  );
}

export default MaProchaineRecette;
