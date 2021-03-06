import axios from "axios";
import produce from "immer";
import { cache, mutate } from "swr";
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

async function updateCatalogRecipe({ recipeToSend }) {
  try {
    const response = await axios.put(
      `/api/catalogs/recipes/${recipeToSend.id}/`,
      recipeToSend
    );
    return response;
  } catch (error) {
    throw error.response ? error.response.data : [];
  }
}

/**
 * Hook using use-mutation lib, to make put request updating a recipe
 * and update optimistically the UI, with the possibility to rollback
 * in case of error.
 * @param {object} obj two functions to be called when the
 *   backend reply arrives. One in case of success and one in
 *   case of failure.
 * @returns array containing a function to update catalog recipe,
 *   and an object with additional information like errors.
 */
function useUpdateCatalogRecipe({ onSuccess, onFailure }) {
  const key = "/api/catalogs/recipes/";
  return useMutation(updateCatalogRecipe, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current) => {
          const updatedRecipes = produce(current, (draftState) => {
            const index = draftState.findIndex((recipe) => {
              return recipe.id === input.recipeToSend.id;
            });
            draftState.splice(index, 1, input.recipeToSend);
          });
          return updatedRecipes;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }) {
      mutate(key, (current) =>
        current.map((recipe) => {
          if (recipe.id === data.data.id) return data.data;
          return recipe;
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
 * @returns array containing a function to remove catalog ingredient,
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
          const ingredientsListUpdated = produce(current, (draftState) => {
            const index = draftState.findIndex((ingredient) => {
              return ingredient.name === input.ingredientToSend.name;
            });
            draftState.splice(index, 1);
          });
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
 * @returns array containing a function to remove catalog recipe,
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
          const updatedRecipes = produce(current, (draftState) => {
            const index = draftState.findIndex((recipe) => {
              return recipe.id === input.recipeToSend.id;
            });
            draftState.splice(index, 1);
          });
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

async function deleteFridgeIngredient({ ingredientToSend }) {
  try {
    const response = await axios.delete(
      `/api/fridge/ingredients/${ingredientToSend.id}/`
    );
    return response;
  } catch (error) {
    throw error.response ? error.response.data : [];
  }
}

/**
 * Hook using use-mutation lib, to make delete request removing a fridge
 * ingredient and update optimistically the UI, with the possibility to
 * rollback in case of error.
 * @param {object} obj two functions to be called when the
 *   backend reply arrives. One in case of success and one in
 *   case of failure.
 * @returns array containing a function to remove fridge ingredient,
 *   and an object with additional information like errors.
 */
function useDeleteFridgeIngredient({ onSuccess, onFailure }) {
  const key = "/api/fridge/ingredients/";
  return useMutation(deleteFridgeIngredient, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current) => {
          const fridgeIngredientsUpdated = produce(current, (draftState) => {
            const index = draftState.findIndex((ingredient) => {
              return ingredient.id === input.ingredientToSend.id;
            });
            draftState.splice(index, 1);
          });
          return fridgeIngredientsUpdated;
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
      if (onFailure) onFailure(input.ingredientToSend.id);
    },
  });
}

export {
  useAddCatalogIngredient,
  useAddCatalogRecipe,
  useUpdateCatalogRecipe,
  useDeleteCatalogIngredient,
  useDeleteCatalogRecipe,
  useDeleteFridgeIngredient,
};
