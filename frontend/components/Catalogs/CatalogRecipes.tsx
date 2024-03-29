import React, { ChangeEvent, useState } from "react";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/paths";
import { CatalogRecipe, CatalogRecipeToSend } from "../../constants/types";
import {
  useAddCatalogRecipe,
  useCatalogRecipes,
  useDeleteCatalogRecipe,
  useUpdateCatalogRecipe,
} from "../../hooks/";
import Recipe from "../Recipe/Recipe";
import type { FormInputs } from "../Recipe/RecipesForm";
import RecipesForm from "../Recipe/RecipesForm";
import useFilterSearch from "../useFilterSearch";
import styles from "./CatalogRecipe.module.scss";

type DeleteError = {
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
  const [deleteError, setDeleteError] = useState<DeleteError>({});
  const [postError, setPostError] = useState("");
  const [recipeToEdit, setRecipeToEdit] = useState<null | CatalogRecipe>(null);
  const { catalogRecipes } = useCatalogRecipes();
  const [addCatalogRecipe] = useAddCatalogRecipe({
    onSuccess: () => {
      void mutate(API_PATHS.fridgeRecipes);
    },
    onFailure: () => {
      setPostError("L'ajout de recette a échoué.");
    },
  });
  const [updateCatalogRecipe] = useUpdateCatalogRecipe({
    onSuccess: () => {
      void mutate(API_PATHS.fridgeRecipes);
    },
    onFailure: () => {
      setPostError("La modification de la recette a échoué.");
    },
  });
  const [deleteCatalogRecipe] = useDeleteCatalogRecipe({
    onSuccess: () => {
      void mutate(API_PATHS.fridgeRecipes);
    },
    onFailure: (id: string) => {
      setDeleteError({
        id: id,
        message: "La suppression a échoué. Veuillez réessayer ultérieurement.",
      });
    },
  });

  const handleSupprClick = (id?: string) => {
    const index = catalogRecipes.findIndex((recipe: CatalogRecipe) => {
      return recipe.id === id;
    });
    const recipeToDelete = catalogRecipes[index];
    if (recipeToDelete.id) {
      void deleteCatalogRecipe({ recipeToDeleteID: recipeToDelete.id });
    } else
      setDeleteError({
        id: undefined,
        message: "La suppression a échoué. Veuillez réessayer ultérieurement.",
      });
  };

  const handleEditClick = (id: string) => {
    catalogRecipes.forEach((recipeObject: CatalogRecipe) => {
      for (const key in recipeObject) {
        if (key === "id" && recipeObject[key] === id) {
          setRecipeToEdit(recipeObject);
        }
      }
    });
  };

  const handleSubmit = (data: FormInputs) => {
    const categories = data.categories.filter(Boolean);
    const recipeToSend: CatalogRecipeToSend = {
      categories: categories,
      title: data.recipeTitle,
      ingredients: data.recipeIngredients,
      duration: data.recipeTime,
      description: data.recipeDescription,
    };
    if (recipeToEdit) {
      recipeToSend.id = recipeToEdit.id;
      void updateCatalogRecipe({ recipeToSend });
    } else {
      void addCatalogRecipe({ recipeToSend });
    }
  };

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchResults(event.target.value);
  };

  const filteredRecipes = useFilterSearch<CatalogRecipe>({
    elementsToFilter: catalogRecipes,
    searchResults: searchResults,
    getSearchElement: (recipe: CatalogRecipe) => recipe.title,
  });

  const allMyRecipes = filteredRecipes.map((myRecipe: CatalogRecipe) => {
    const button = (
      <div className={styles.buttonsContainer}>
        <button
          className={styles.editButton}
          onClick={() => myRecipe.id && handleEditClick(myRecipe.id)}
          aria-label="Modifier la recette"
        >
          <img className={styles.editImg} src="images/edit.svg" alt="" />
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => handleSupprClick(myRecipe.id)}
          aria-label="Supprimer la recette"
        >
          <img className={styles.deleteImg} src="images/delete.svg" alt="" />
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
    <main className={styles.catalogRecipesComponent}>
      <h1 className={styles.title}>Catalogue de toutes mes recettes</h1>
      <section className={styles.addRecipesSection}>
        <RecipesForm
          onSubmitRecipe={handleSubmit}
          recipeToEdit={recipeToEdit}
          resetRecipeToEdit={() => setRecipeToEdit(null)}
        />
        {postError && (
          <p role="alert" className={styles.errorMessage}>
            {postError}
          </p>
        )}
      </section>
      <section
        className={styles.displayCatalogRecipeSection}
        data-testid="catalogRecipesList"
      >
        <form className={styles.searchbox}>
          <input
            type="search"
            className={styles.searchboxInput}
            name="q"
            value={searchResults}
            placeholder="Recherche par titre..."
            spellCheck="true"
            size={30}
            onChange={handleChangeSearch}
          />
        </form>
        <div className={styles.displayCatalogRecipe}>{allMyRecipes}</div>
      </section>
    </main>
  );
}

export default CatalogRecipes;
