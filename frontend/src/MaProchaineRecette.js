import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import axios from "axios";
import RecettesAffichage from "./RecettesAffichage";
import FridgeIngredients from "./FridgeIngredients";
import CatalogIngredients from "./CatalogIngredients";
import RecettesCatalogue from "./RecettesCatalogue";
import "./MaProchaineRecette.css";
import "./Nav.css";

function MaProchaineRecette() {
  const [catalogIngredients, setCatalogIngredients] = useState([]);
  const [recettesCatalogue, setRecettesCatalogue] = useState([]);
  const [fridgeIngredients, setFridgeIngredients] = useState([]);
  const [categoriesCatalogue, setCategoriesCatalogue] = useState([]);
  const [units, setUnits] = useState([]);
  const [feasibleRecipes, setFeasibleRecipes] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const handlePossibleIngredients = (ingredients) => {
    setCatalogIngredients(ingredients);
  };

  useEffect(() => {
    axios
      .get("/catalogues/ingredients/")
      .then(({ data }) => {
        setCatalogIngredients(data);
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
            name: ingredientFrigo.ingredient,
            expirationDate: new Date(ingredientFrigo.expiration_date),
            amount: ingredientFrigo.amount,
            unit: ingredientFrigo.unit,
          };
        });
        setFridgeIngredients(newData);
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
      .get("/units/")
      .then(({ data }) => {
        setUnits(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
    axios
      .get("/frigo/recettes/")
      .then(({ data }) => {
        setFeasibleRecipes(data);
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
            possibleIngredients={catalogIngredients}
            totalCategories={categoriesCatalogue}
            totalUnits={units}
          />
        </Route>
        <Route path="/ingredients">
          <CatalogIngredients
            possibleIngredients={catalogIngredients}
            updatePossibleIngredients={handlePossibleIngredients}
          />
        </Route>
        <Route path="/" exact>
          <main id="MesProchainesRecettes">
            <FridgeIngredients
              ingredients={fridgeIngredients}
              possibleIngredients={catalogIngredients}
              totalUnits={units}
            />
            <RecettesAffichage recettes={feasibleRecipes} />
          </main>
        </Route>
      </div>
    </Router>
  );
}

export default MaProchaineRecette;
