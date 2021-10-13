import React, { ChangeEvent, useState } from "react";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/paths";
import { RecipeToSendType, RecipeType } from "../../constants/types";
import { useCatalogRecipes } from "../../hooks/swrFetch";
import {
  useAddCatalogRecipe,
  useDeleteCatalogRecipe,
  useUpdateCatalogRecipe,
} from "../../hooks/swrMutate";
import Recipe from "../Recipe/Recipe";
import RecipesForm from "../Recipe/RecipesForm";
import useFilterSearch from "../useFilterSearch";

type DeleteErrorType = {
  id?: string;
  message?: string;
};

/**
 * Ce composant permet d'afficher les recettes du catalogue, d'en ajouter
 * et d'en supprimer. Une recherche peut etre faite sur le nom des recettes et
 * permettra d'afficher au fur et à mesure les recettes correspondantes.
 *
 * @component
 */
function CatalogRecipes() {
  const [searchResults, setSearchResults] = useState("");
  const [deleteError, setDeleteError] = useState<DeleteErrorType>({});
  const [postError, setPostError] = useState("");
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const { catalogRecipes } = useCatalogRecipes();
  const [addCatalogRecipe] = useAddCatalogRecipe({
    onSuccess: () => mutate(API_PATHS.fridgeRecipes),
    onFailure: () => {
      setPostError("L'ajout de recette a échoué.");
    },
  });
  const [updateCatalogRecipe] = useUpdateCatalogRecipe({
    onSuccess: () => mutate(API_PATHS.fridgeRecipes),
    onFailure: () => {
      setPostError("La modification de la recette a échoué.");
    },
  });
  const [deleteCatalogRecipe] = useDeleteCatalogRecipe({
    onSuccess: () => mutate(API_PATHS.fridgeRecipes),
    onFailure: (id: string) => {
      setDeleteError({
        id: id,
        message: "La suppression a échoué. Veuillez réessayer ultérieurement.",
      });
    },
  });

  const handleSupprClick = (id: string) => {
    const index = catalogRecipes.findIndex((recipe: RecipeType) => {
      return recipe.id === id;
    });
    const recipeToSend = catalogRecipes[index];
    deleteCatalogRecipe({ recipeToSend });
  };

  const handleEditClick = (id: string) => {
    catalogRecipes.forEach((recipeObject: any) => {
      for (const key in recipeObject) {
        if (key === "id" && recipeObject[key] === id) {
          setRecipeToEdit(recipeObject);
        }
      }
    });
  };

  const handleSubmit = async (data: any) => {
    const categories = data.categories.filter(Boolean);
    let recipeToSend: RecipeToSendType = {
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

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchResults(event.target.value);
  };

  const filteredRecipes = useFilterSearch({
    elementsToFilter: catalogRecipes,
    searchResults: searchResults,
    getSearchElement: (recipe: RecipeType) => recipe.title,
  });

  const allMyRecipes = filteredRecipes.map((myRecipe: RecipeType) => {
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
            size={30}
            onChange={handleChangeSearch}
          />
        </form>
        {allMyRecipes}
      </section>
    </main>
  );
}

export default CatalogRecipes;
