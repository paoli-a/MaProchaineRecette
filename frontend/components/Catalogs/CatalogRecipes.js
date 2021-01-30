import React, { useState } from "react";
import RecipesForm from "../Recipe/RecipesForm";
import Recipe from "../Recipe/Recipe";
import useFilterSearch from "../useFilterSearch";
import PropTypes from "prop-types";
import axios from "axios";

/**
 * Ce composant permet d'afficher les recettes du catalogue, d'en ajouter
 * et d'en supprimer. Une recherche peut etre faite sur le nom des recettes et
 * permettra d'afficher au fur et à mesure les recettes correspondantes.
 *
 * @component
 */
function CatalogRecipes({
  totalRecipes,
  possibleIngredients,
  totalCategories,
  totalUnits,
  feasibleRecipesUpdate,
  updateRecipes,
}) {
  const [searchResults, setSearchResults] = useState("");
  const [deleteError, setDeleteError] = useState({});
  const [postError, setPostError] = useState("");

  const handleSupprClick = (id) => {
    axios
      .delete(`/api/catalogs/recipes/${id}/`)
      .then(() => {
        const updatedRecipes = totalRecipes.slice();
        const index = updatedRecipes.findIndex((recipe) => {
          return recipe.id === id;
        });
        updatedRecipes.splice(index, 1);
        feasibleRecipesUpdate();
        updateRecipes(updatedRecipes);
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
      .post("/api/catalogs/recipes/", recipeToSend)
      .then(({ data }) => {
        const newRecipe = data;
        const updatedRecipes = totalRecipes.slice();
        updatedRecipes.push(newRecipe);
        feasibleRecipesUpdate();
        updateRecipes(updatedRecipes);
      })
      .catch(() => {
        setPostError("L'ajout de recette a échoué.");
      });
  };

  const handleChangeSearch = (event) => {
    setSearchResults(event.target.value);
  };

  const filteredRecipes = useFilterSearch({
    elementsToFilter: totalRecipes,
    searchResults: searchResults,
    getSearchElement: (recipe) => recipe.title,
  });

  const allMyRecipes = filteredRecipes.map((myRecipe) => {
    const button = (
      <button
        className="button"
        onClick={() => handleSupprClick(myRecipe.id)}
        aria-label="Supprimer la recette"
      >
        X
      </button>
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
    <main className="component-catalog-recipe">
      <h1 className="component-catalog-recipe__title">
        Catalogue de toutes mes recettes
      </h1>
      <section className="add-recipe">
        <RecipesForm
          onSubmitRecipe={handleSubmit}
          possibleIngredients={possibleIngredients}
          totalCategories={totalCategories}
          totalUnits={totalUnits}
        />
        {postError && (
          <p role="alert" className="recipe__error-message">
            {postError}
          </p>
        )}
      </section>
      <section className="display-catalog-recipe">
        <form className="searchbox">
          <input
            type="search"
            className="searchbox__input"
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
  feasibleRecipesUpdate: PropTypes.func.isRequired,
  updateRecipes: PropTypes.func.isRequired,
};

export default CatalogRecipes;
