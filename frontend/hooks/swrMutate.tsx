import axios from "axios";
import produce from "immer";
import { cache, mutate } from "swr";
import useMutation from "use-mutation";
import { API_PATHS } from "../constants/paths";
import {
  FridgeIngredientType,
  IngredientType,
  RecipeType,
} from "../constants/types";

async function addCatalogIngredient({ ingredientToSend }: any) {
  try {
    const response = await axios.post(
      API_PATHS.catalogIngredients,
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
function useAddCatalogIngredient({ onSuccess, onFailure }: any) {
  const key = API_PATHS.catalogIngredients;
  return useMutation(addCatalogIngredient, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: any) => [...current, input.ingredientToSend],
        false
      );
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

async function addCatalogRecipe({ recipeToSend }: any) {
  try {
    const response = await axios.post(API_PATHS.catalogRecipes, recipeToSend);
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
function useAddCatalogRecipe({ onSuccess, onFailure }: any) {
  const key = API_PATHS.catalogRecipes;
  return useMutation(addCatalogRecipe, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(key, (current: any) => [...current, input.recipeToSend], false);
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }) {
      mutate(key, (current: any) =>
        current.map((recipe: RecipeType) => {
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

async function updateCatalogRecipe({ recipeToSend }: any) {
  try {
    const response = await axios.put(
      `${API_PATHS.catalogRecipes}${recipeToSend.id}/`,
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
function useUpdateCatalogRecipe({ onSuccess, onFailure }: any) {
  const key = API_PATHS.catalogRecipes;
  return useMutation(updateCatalogRecipe, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: any) => {
          const updatedRecipes = produce(current, (draftState: any) => {
            const index = draftState.findIndex((recipe: RecipeType) => {
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
      mutate(key, (current: any) =>
        current.map((recipe: RecipeType) => {
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

async function deleteCatalogIngredient({ ingredientToSend }: any) {
  try {
    const response = await axios.delete(
      `${API_PATHS.catalogIngredients}${ingredientToSend.name}/`
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
function useDeleteCatalogIngredient({ onSuccess, onFailure }: any) {
  const key = API_PATHS.catalogIngredients;
  return useMutation(deleteCatalogIngredient, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: any) => {
          const ingredientsListUpdated = produce(current, (draftState: any) => {
            const index = draftState.findIndex((ingredient: IngredientType) => {
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

async function deleteCatalogRecipe({ recipeToSend }: any) {
  try {
    const response = await axios.delete(
      `${API_PATHS.catalogRecipes}${recipeToSend.id}/`
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
function useDeleteCatalogRecipe({ onSuccess, onFailure }: any) {
  const key = API_PATHS.catalogRecipes;
  return useMutation(deleteCatalogRecipe, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: any) => {
          const updatedRecipes = produce(current, (draftState: any) => {
            const index = draftState.findIndex((recipe: RecipeType) => {
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
      mutate(key, (current: any) => current);
      if (onSuccess) onSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (onFailure) onFailure(input.recipeToSend.id);
    },
  });
}

async function deleteFridgeIngredient({ ingredientToSend }: any) {
  try {
    const response = await axios.delete(
      `${API_PATHS.fridgeIngredients}${ingredientToSend.id}/`
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
function useDeleteFridgeIngredient({ onSuccess, onFailure }: any) {
  const key = API_PATHS.fridgeIngredients;
  return useMutation(deleteFridgeIngredient, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: any) => {
          const fridgeIngredientsUpdated = produce(
            current,
            (draftState: any) => {
              const index = draftState.findIndex(
                (ingredient: FridgeIngredientType) => {
                  return ingredient.id === input.ingredientToSend.id;
                }
              );
              draftState.splice(index, 1);
            }
          );
          return fridgeIngredientsUpdated;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      mutate(key, (current: any) => current);
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
