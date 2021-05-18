import axios from "axios";
import { mutate, cache } from "swr";
import useMutation from "use-mutation";

async function addCatalogIngredient({ ingredientToSend }) {
  try {
    const response = await axios.post(
      "/api/catalogs/ingredients/",
      ingredientToSend
    );
    return response;
  } catch (error) {
    throw error.response ? error.response.data : [];
  }
}

/**
 * Hook using use-mutation lib, to make post request adding an
 * ingredient and update optimistically the UI, with the possibility
 * to rollback in case of error.
 * @param {object} obj two functions to be called when the
 *   backend reply arrives. One in case of success and one in
 *   case of failure.
 * @returns array containing a function to add catalog ingredient,
 *   and an object with additional information like errors.
 */
function useAddCatalogIngredient({ onSuccess, onFailure }) {
  const key = "/api/catalogs/ingredients/";
  return useMutation(addCatalogIngredient, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(key, (current) => [...current, input.ingredientToSend], false);
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      mutate(key);
      if (onSuccess) onSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      if (onFailure) onFailure();
    },
  });
}

async function addCatalogRecipe({ recipeToSend }) {
  try {
    const response = await axios.post("/api/catalogs/recipes/", recipeToSend);
    return response;
  } catch (error) {
    throw error.response ? error.response.data : [];
  }
}

/**
 * Hook using use-mutation lib, to make post request adding a recipe
 * and update optimistically the UI, with the possibility to rollback
 * in case of error.
 * @param {object} obj two functions to be called when the
 *   backend reply arrives. One in case of success and one in
 *   case of failure.
 * @returns array containing a function to add catalog recipe,
 *   and an object with additional information like errors.
 */
function useAddCatalogRecipe({ onSuccess, onFailure }) {
  const key = "/api/catalogs/recipes/";
  return useMutation(addCatalogRecipe, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(key, (current) => [...current, input.recipeToSend], false);
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }) {
      mutate(key, (current) =>
        current.map((recipe) => {
          if (recipe.id) return recipe;
          return data.data;
        })
      );
      if (onSuccess) onSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      if (onFailure) onFailure();
    },
  });
}

async function deleteCatalogIngredient({ ingredientToSend }) {
  try {
    const response = await axios.delete(
      `/api/catalogs/ingredients/${ingredientToSend.name}/`
    );
    return response;
  } catch (error) {
    throw error.response ? error.response.data : [];
  }
}

/**
 * Hook using use-mutation lib, to make delete request, removing an
 * ingredient and update optimistically the UI, with the possibility
 * to rollback in case of error.
 * @param {object} obj two functions to be called when the
 *   backend reply arrives. One in case of success and one in
 *   case of failure.
 * @returns array containing a function to add catalog ingredient,
 *   and an object with additional information like errors.
 */
function useDeleteCatalogIngredient({ onSuccess, onFailure }) {
  const key = "/api/catalogs/ingredients/";
  return useMutation(deleteCatalogIngredient, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current) => {
          const ingredientsListUpdated = current.slice();
          const index = ingredientsListUpdated.findIndex((ingredient) => {
            return ingredient.name === input.ingredientToSend.name;
          });
          ingredientsListUpdated.splice(index, 1);
          return ingredientsListUpdated;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      mutate(key);
      if (onSuccess) onSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (onFailure) onFailure(input.ingredientToSend.name);
    },
  });
}

async function deleteCatalogRecipe({ recipeToSend }) {
  try {
    const response = await axios.delete(
      `/api/catalogs/recipes/${recipeToSend.id}/`
    );
    return response;
  } catch (error) {
    throw error.response ? error.response.data : [];
  }
}

/**
 * Hook using use-mutation lib, to make delete request removing a recipe
 * and update optimistically the UI, with the possibility to rollback
 * in case of error.
 * @param {object} obj two functions to be called when the
 *   backend reply arrives. One in case of success and one in
 *   case of failure.
 * @returns array containing a function to add catalog recipe,
 *   and an object with additional information like errors.
 */
function useDeleteCatalogRecipe({ onSuccess, onFailure }) {
  const key = "/api/catalogs/recipes/";
  return useMutation(deleteCatalogRecipe, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current) => {
          const updatedRecipes = current.slice();
          const index = updatedRecipes.findIndex((recipe) => {
            return recipe.id === input.recipeToSend.id;
          });
          updatedRecipes.splice(index, 1);
          return updatedRecipes;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      mutate(key, (current) => current);
      if (onSuccess) onSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (onFailure) onFailure(input.recipeToSend.id);
    },
  });
}

export {
  useAddCatalogIngredient,
  useAddCatalogRecipe,
  useDeleteCatalogIngredient,
  useDeleteCatalogRecipe,
};
