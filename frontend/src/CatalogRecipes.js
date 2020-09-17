import React, { useState, useEffect } from "react";
import RecipesForm from "./RecipesForm";
import Recipe from "./Recipe";
import useFilterSearch from "./useFilterSearch";
import "./CatalogRecipes.css";
import PropTypes from "prop-types";
import axios from "axios";

function CatalogRecipes({
  totalRecipes,
  possibleIngredients,
  totalCategories,
  totalUnits,
}) {
  const [recipesList, setRecipes] = useState(totalRecipes);
  const [searchResults, setSearchResults] = useState("");
  const [deleteError, setDeleteError] = useState({});
  const [postError, setPostError] = useState("");

  useEffect(() => {
    setRecipes(totalRecipes);
  }, [totalRecipes]);

  const handleSupprClick = (id) => {
    axios
      .delete(`/catalogs/recipes/${id}/`)
      .then(() => {
        const updatedRecipes = recipesList.slice();
        const index = updatedRecipes.findIndex((recipe) => {
          return recipe.id === id;
        });
        updatedRecipes.splice(index, 1);
        setRecipes(updatedRecipes);
      })
      .catch(() => {
        setDeleteError({
          id: id,
          message:
            "La suppression a échoué. Veuillez réessayer ultérieurement.",
        });
      });
  };

  const handleSubmit = (data) => {
    const categories = data.categories.filter(Boolean);
    const recipeToSend = {
      categories: categories,
      title: data.recipeTitle,
      ingredients: data.ingredients,
      duration: data.recipeTime,
      description: data.recipeDescription,
    };
    axios
      .post("/catalogs/recipes/", recipeToSend)
      .then(({ data }) => {
        const newRecipe = data;
        const updatedRecipes = recipesList.slice();
        updatedRecipes.push(newRecipe);
        setRecipes(updatedRecipes);
      })
      .catch((e) => {
        setPostError("L'ajout de recette a échoué.");
      });
  };

  const handleChangeSearch = (event) => {
    setSearchResults(event.target.value);
  };

  const filteredRecipes = useFilterSearch({
    elementsToFilter: recipesList,
    searchResults: searchResults,
    getSearchElement: (recipe) => recipe.title,
  });

  const allMyRecipes = filteredRecipes.map((myRecipe) => {
    const button = (
      <button onClick={() => handleSupprClick(myRecipe.id)}>X</button>
    );
    return (
      <React.Fragment key={myRecipe.id}>
        <Recipe
          key={myRecipe.id}
          recipe={myRecipe}
          activateClick={true}
          optionalButton={button}
        />
        {deleteError.id === myRecipe.id && <span>{deleteError.message}</span>}
      </React.Fragment>
    );
  });

  return (
    <main id="ComponentCatalogRecipe">
      <h1>Catalogue de toutes mes recettes</h1>
      <section id="AddRecipe">
        <RecipesForm
          onSubmitRecipe={handleSubmit}
          possibleIngredients={possibleIngredients}
          totalCategories={totalCategories}
          totalUnits={totalUnits}
        />
        {postError && <span>{postError}</span>}
      </section>
      <section id="DisplayCatalogRecipe">
        <form>
          <input
            type="search"
            id="catalogRecipeSearch"
            name="q"
            value={searchResults}
            placeholder="Recherche par titre..."
            spellCheck="true"
            size="30"
            onChange={handleChangeSearch}
          />
        </form>
        {allMyRecipes}
      </section>
    </main>
  );
}

CatalogRecipes.propTypes = {
  totalRecipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired,
      ingredients: PropTypes.arrayOf(
        PropTypes.shape({
          ingredient: PropTypes.string.isRequired,
          amount: PropTypes.string.isRequired,
          unit: PropTypes.string.isRequired,
        }).isRequired
      ),
      duration: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  /**
   * Il s'agit ici des ingrédients autorisés, c'est-à-dire ceux entrés
   * dans le catalogue des ingrédients.
   */
  possibleIngredients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  totalUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CatalogRecipes;
