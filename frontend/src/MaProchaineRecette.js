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

function MaProchaineRecette() {
  const [ingredientsCatalogue, setIngredientsCatalogue] = useState([]);
  const [recettesCatalogue, setRecettesCatalogue] = useState([]);
  const [ingredientsFrigo, setIngredientsFrigo] = useState([]);
  const [categoriesCatalogue, setCategoriesCatalogue] = useState([]);
  const [unites, setUnites] = useState([]);
  const [feasibleRecipes, setRecettesFrigo] = useState([]);
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
        setRecettesCatalogue(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
    axios
      .get("/frigo/ingredients/")
      .then(({ data }) => {
        const newData = data.map((ingredientFrigo) => {
          return {
            id: ingredientFrigo.id,
            nom: ingredientFrigo.ingredient,
            datePeremption: new Date(ingredientFrigo.date_peremption),
            quantite: ingredientFrigo.quantite,
            unite: ingredientFrigo.unite,
          };
        });
        setIngredientsFrigo(newData);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
    axios
      .get("/catalogues/categories/")
      .then(({ data }) => {
        setCategoriesCatalogue(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
    axios
      .get("/unites/")
      .then(({ data }) => {
        setUnites(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
    axios
      .get("/frigo/recettes/")
      .then(({ data }) => {
        setRecettesFrigo(data);
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
            totalCategories={categoriesCatalogue}
            totalUnites={unites}
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
              totalUnites={unites}
            />
            <RecettesAffichage recettes={feasibleRecipes} />
          </main>
        </Route>
      </div>
    </Router>
  );
}

MaProchaineRecette.propTypes = {};

export default MaProchaineRecette;
