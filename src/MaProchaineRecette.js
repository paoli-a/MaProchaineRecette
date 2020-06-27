import React, { useState } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import RecettesAffichage from "./RecettesAffichage";
import IngredientsFrigo from "./IngredientsFrigo";
import IngredientsCatalogue from "./IngredientsCatalogue";
import RecettesCatalogue from "./RecettesCatalogue";
import "./MaProchaineRecette.css";
import "./Nav.css";
import PropTypes from "prop-types";

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
          <NavLink activeClassName="currentTab" exact={true} to="/">
            Ma prochaine recette
          </NavLink>
          <NavLink activeClassName="currentTab" to="/recettes">
            Catalogue des recettes
          </NavLink>
          <NavLink activeClassName="currentTab" to="/ingredients">
            Catalogue des ingrédients
          </NavLink>
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

MaProchaineRecette.propTypes = {
  recettes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      categorie: PropTypes.arrayOf(PropTypes.string).isRequired,
      titre: PropTypes.string.isRequired,
      ingredients: PropTypes.objectOf(PropTypes.string).isRequired,
      temps: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  ingredientsFrigo: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nom: PropTypes.string.isRequired,
      datePeremption: PropTypes.instanceOf(Date),
      quantite: PropTypes.string.isRequired,
    })
  ).isRequired,
  ingredientsCatalogue: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nom: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MaProchaineRecette;
