import React, { useState } from "react";
import { mutate } from "swr";
import { useCatalogRecipes } from "../../hooks/swrFetch";
import {
  useAddCatalogRecipe,
  useDeleteCatalogRecipe,
  useUpdateCatalogRecipe,
} from "../../hooks/swrMutate";
import Recipe from "../Recipe/Recipe";
import RecipesForm from "../Recipe/RecipesForm";
import useFilterSearch from "../useFilterSearch";

/**
 * Ce composant permet d'afficher les recettes du catalogue, d'en ajouter
 * et d'en supprimer. Une recherche peut etre faite sur le nom des recettes et
 * permettra d'afficher au fur et à mesure les recettes correspondantes.
 *
 * @component
 */
function CatalogRecipes() {
  const [searchResults, setSearchResults] = useState("");
  const [deleteError, setDeleteError] = useState({});
  const [postError, setPostError] = useState("");
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const { catalogRecipes } = useCatalogRecipes();
  const [addCatalogRecipe] = useAddCatalogRecipe({
    onSuccess: () => mutate("/api/fridge/recipes/"),
    onFailure: () => {
      setPostError("L'ajout de recette a échoué.");
    },
  });
  const [updateCatalogRecipe] = useUpdateCatalogRecipe({
    onSuccess: () => mutate("/api/fridge/recipes/"),
    onFailure: () => {
      setPostError("La modification de la recette a échoué.");
    },
  });
  const [deleteCatalogRecipe] = useDeleteCatalogRecipe({
    onSuccess: () => mutate("/api/fridge/recipes/"),
    onFailure: (id) => {
      setDeleteError({
        id: id,
        message: "La suppression a échoué. Veuillez réessayer ultérieurement.",
      });
    },
  });

  const handleSupprClick = (id) => {
    const index = catalogRecipes.findIndex((recipe) => {
      return recipe.id === id;
    });
    const recipeToSend = catalogRecipes[index];
    deleteCatalogRecipe({ recipeToSend });
  };

  const handleEditClick = (id) => {
    catalogRecipes.forEach((recipeObject) => {
      for (const key in recipeObject) {
        if (key === "id" && recipeObject[key] === id) {
          setRecipeToEdit(recipeObject);
        }
      }
    });
  };

  const handleSubmit = async (data) => {
    const categories = data.categories.filter(Boolean);
    let recipeToSend = {
      categories: categories,
      title: data.recipeTitle,
      ingredients: data.ingredients,
      duration: data.recipeTime,
      description: data.recipeDescription,
    };
    if (recipeToEdit) {
      recipeToSend.id = recipeToEdit.id;
      updateCatalogRecipe({ recipeToSend });
    } else {
      addCatalogRecipe({ recipeToSend });
    }
  };

  const handleChangeSearch = (event) => {
    setSearchResults(event.target.value);
  };

  const filteredRecipes = useFilterSearch({
    elementsToFilter: catalogRecipes,
    searchResults: searchResults,
    getSearchElement: (recipe) => recipe.title,
  });

  const allMyRecipes = filteredRecipes.map((myRecipe) => {
    const button = (
      <div className="buttons-container">
        <button
          className="button fridge-ingredient-details__edit"
          onClick={() => handleEditClick(myRecipe.id)}
        >
          <img
            className="fridge-ingredient-details__edit-img"
            src="images/edit.svg"
            alt="Modifier"
          />
        </button>
        <button
          className="button fridge-ingredient-details__delete"
          onClick={() => handleSupprClick(myRecipe.id)}
          aria-label="Supprimer la recette"
        >
          <img
            className="fridge-ingredient-details__delete-img"
            src="images/delete.svg"
            alt="Supprimer"
          />
        </button>
      </div>
    );
    return (
      <React.Fragment
        key={
          myRecipe.id ? myRecipe.id : `${myRecipe.title}${myRecipe.description}`
        }
      >
        <Recipe
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
          recipeToEdit={recipeToEdit}
          resetRecipeToEdit={() => setRecipeToEdit(null)}
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

export default CatalogRecipes;
