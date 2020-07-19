import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import axios from "axios";
import RecettesAffichage from "./RecettesAffichage";
import IngredientsFrigo from "./IngredientsFrigo";
import IngredientsCatalogue from "./IngredientsCatalogue";
import RecettesCatalogue from "./RecettesCatalogue";
import "./MaProchaineRecette.css";
import "./Nav.css";
import PropTypes from "prop-types";

function MaProchaineRecette({ recettes, ingredientsFrigo }) {
  const [ingredientsCatalogue, setIngredientsCatalogue] = useState([]);
  const [recettesCatalogue, setRecetteCatalogue] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const handleIngredientsPossibles = (ingredients) => {
    setIngredientsCatalogue(ingredients);
  };

  useEffect(() => {
    axios
      .get("/catalogues/ingredients/")
      .then(({ data }) => {
        setIngredientsCatalogue(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
    axios
      .get("/catalogues/recettes/")
      .then(({ data }) => {
        setRecetteCatalogue(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
  }, []);

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
        {fetchError && <span>{fetchError}</span>}
        <Route path="/recettes">
          <RecettesCatalogue
            totalRecettes={recettesCatalogue}
            ingredientsPossibles={ingredientsCatalogue}
          />
        </Route>
        <Route path="/ingredients">
          <IngredientsCatalogue
            ingredientsPossibles={ingredientsCatalogue}
            updateIngredientsPossibles={handleIngredientsPossibles}
          />
        </Route>
        <Route path="/" exact>
          <main id="MesProchainesRecettes">
            <IngredientsFrigo
              ingredients={ingredientsFrigo}
              ingredientsPossibles={ingredientsCatalogue}
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
      categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      titre: PropTypes.string.isRequired,
      ingredients: PropTypes.arrayOf(
        PropTypes.shape({
          ingredient: PropTypes.string.isRequired,
          quantite: PropTypes.string.isRequired,
          unite: PropTypes.string.isRequired,
        }).isRequired
      ),
      duree: PropTypes.string.isRequired,
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
};

export default MaProchaineRecette;
