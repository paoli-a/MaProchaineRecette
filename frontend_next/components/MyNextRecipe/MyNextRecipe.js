import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import axios from "axios";
import FridgeRecipes from "../Fridge/FridgeRecipes";
import FridgeIngredients from "../Fridge/FridgeIngredients";
import CatalogIngredients from "../Catalogs/CatalogIngredients";
import CatalogRecipes from "../Catalogs/CatalogRecipes";
import Page from "./Page";

/**
 * Ce composant est le composant principal. Il permet d'afficher le menu, avec les trois pages :
 * - les ingrédients du frigo et les recettes possibles en fonction de ceux-ci
 * - le catalogue d'ingrédients
 * - le catalogue des recettes
 *
 * @component
 */
function MyNextRecipe() {
  const [catalogIngredients, setCatalogIngredients] = useState([]);
  const [catalogRecipes, setCatalogRecipes] = useState([]);
  const [fridgeIngredients, setFridgeIngredients] = useState([]);
  const [catalogCategories, setCatalogCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [feasibleRecipes, setFeasibleRecipes] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const handlePossibleIngredients = (ingredients) => {
    setCatalogIngredients(ingredients);
  };

  const handleNewRecipe = (recipes) => {
    setCatalogRecipes(recipes);
  };

  const handleFridgeIngredient = (fridgeIngredients) => {
    setFridgeIngredients(fridgeIngredients);
  };

  const fetchesFeasibleRecipes = () => {
    axios
      .get("/api/fridge/recipes/")
      .then(({ data }) => {
        setFeasibleRecipes(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
  };

  useEffect(() => {
    axios
      .get("/api/catalogs/ingredients/")
      .then(({ data }) => {
        setCatalogIngredients(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
    axios
      .get("/api/catalogs/recipes/")
      .then(({ data }) => {
        setCatalogRecipes(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
    axios
      .get("/api/fridge/ingredients/")
      .then(({ data }) => {
        const newData = data.map((fridgeIngredient) => {
          return {
            id: fridgeIngredient.id,
            name: fridgeIngredient.ingredient,
            expirationDate: new Date(fridgeIngredient.expiration_date),
            amount: fridgeIngredient.amount,
            unit: fridgeIngredient.unit,
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
      .get("/api/catalogs/categories/")
      .then(({ data }) => {
        setCatalogCategories(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );
    axios
      .get("/api/units/units/")
      .then(({ data }) => {
        setUnits(data);
      })
      .catch(() =>
        setFetchError(
          "Il y a eu une erreur vis-à-vis du serveur, veuillez reharger la page ou réessayer ultérieurement."
        )
      );

    fetchesFeasibleRecipes();
  }, []);

  return (
    <Router>
      <div>
        <nav className="nav">
          <NavLink
            className="nav__link"
            activeClassName="nav__link active"
            exact={true}
            to="/"
          >
            Ma prochaine recette
          </NavLink>
          <NavLink
            className="nav__link"
            activeClassName="nav__link active"
            to="/recipes"
          >
            Catalogue des recettes
          </NavLink>
          <NavLink
            className="nav__link"
            activeClassName="nav__link active"
            to="/ingredients"
          >
            Catalogue des ingrédients
          </NavLink>
        </nav>
        {fetchError && <span>{fetchError}</span>}
        <Route path="/recipes">
          <Page title="Catalogue des recettes">
            <CatalogRecipes
              totalRecipes={catalogRecipes}
              possibleIngredients={catalogIngredients}
              totalCategories={catalogCategories}
              totalUnits={units}
              feasibleRecipesUpdate={fetchesFeasibleRecipes}
              updateRecipes={handleNewRecipe}
            />
          </Page>
        </Route>
        <Route path="/ingredients">
          <Page title="Catalogue des ingrédients">
            <CatalogIngredients
              possibleIngredients={catalogIngredients}
              updatePossibleIngredients={handlePossibleIngredients}
            />
          </Page>
        </Route>
        <Route path="/" exact>
          <Page title="Ma prochaine recette">
            <main className="my-next-recipes">
              <FridgeIngredients
                ingredients={fridgeIngredients}
                possibleIngredients={catalogIngredients}
                totalUnits={units}
                feasibleRecipesUpdate={fetchesFeasibleRecipes}
                updateFridgeIngredients={handleFridgeIngredient}
              />
              <FridgeRecipes recipes={feasibleRecipes} />
            </main>
          </Page>
        </Route>
      </div>
    </Router>
  );
}

export default MyNextRecipe;
