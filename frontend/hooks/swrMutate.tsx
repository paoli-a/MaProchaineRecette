import axios from "axios";
import produce from "immer";
import { useSWRConfig } from "swr";
import useMutation from "use-mutation";
import { API_PATHS } from "../constants/paths";
import { isCatalogRecipeResponse } from "../constants/typeGuards";
import {
  CatalogRecipeType,
  FridgeIngredientType,
  IngredientType,
  RecipeToSendType,
} from "../constants/types";

type AddCatalogIngredientArgs = {
  ingredientToSend: IngredientType;
};

async function addCatalogIngredient({
  ingredientToSend,
}: AddCatalogIngredientArgs) {
  try {
    const response = await axios.post(
      API_PATHS.catalogIngredients,
      ingredientToSend
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw Error("Unknown error");
    }
  }
}

type UseAddCatalogIngredientArgs = {
  onSuccess: () => void;
  onFailure: () => void;
};

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
function useAddCatalogIngredient({
  onSuccess: handleSuccess,
  onFailure: handleFailure,
}: UseAddCatalogIngredientArgs) {
  const { cache, mutate } = useSWRConfig();
  const key = API_PATHS.catalogIngredients;
  return useMutation(addCatalogIngredient, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: IngredientType[]) => [...current, input.ingredientToSend],
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      mutate(key);
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      if (handleFailure) handleFailure();
    },
  });
}

type AddCatalogRecipeArgs = {
  recipeToSend: RecipeToSendType;
};

async function addCatalogRecipe({ recipeToSend }: AddCatalogRecipeArgs) {
  try {
    const response = await axios.post(API_PATHS.catalogRecipes, recipeToSend);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw Error("Unknown error");
    }
  }
}

type UseAddCatalogRecipeArgs = UseAddCatalogIngredientArgs;

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
function useAddCatalogRecipe({
  onSuccess: handleSuccess,
  onFailure: handleFailure,
}: UseAddCatalogRecipeArgs) {
  const { cache, mutate } = useSWRConfig();
  const key = API_PATHS.catalogRecipes;
  return useMutation(addCatalogRecipe, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: CatalogRecipeType[]) => [...current, input.recipeToSend],
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }) {
      mutate(key, (current: CatalogRecipeType[]) =>
        current.map((recipe: CatalogRecipeType) => {
          if (recipe.id) return recipe;
          return data.data;
        })
      );
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      if (handleFailure) handleFailure();
    },
  });
}

type UpdateCatalogRecipeArgs = {
  recipeToSend: RecipeToSendType;
};

async function updateCatalogRecipe({ recipeToSend }: UpdateCatalogRecipeArgs) {
  try {
    const response = await axios.put(
      `${API_PATHS.catalogRecipes}${recipeToSend.id}/`,
      recipeToSend
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw Error("Unknown error");
    }
  }
}

type UseUpdateCatalogRecipeArgs = UseAddCatalogIngredientArgs;

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
function useUpdateCatalogRecipe({
  onSuccess: handleSuccess,
  onFailure: handleFailure,
}: UseUpdateCatalogRecipeArgs) {
  const { cache, mutate } = useSWRConfig();
  const key = API_PATHS.catalogRecipes;
  return useMutation(updateCatalogRecipe, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: CatalogRecipeType[]) => {
          const updatedRecipes = produce(
            current,
            (draftState: CatalogRecipeType[]) => {
              const index = draftState.findIndex(
                (recipe: CatalogRecipeType) => {
                  return recipe.id === input.recipeToSend.id;
                }
              );
              draftState.splice(index, 1, input.recipeToSend);
            }
          );
          return updatedRecipes;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }) {
      mutate(key, (current: CatalogRecipeType[]) =>
        current.map((recipe: CatalogRecipeType) => {
          if (isCatalogRecipeResponse(data)) {
            if (recipe.id === data.data.id) return data.data;
          }
          return recipe;
        })
      );
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      if (handleFailure) handleFailure();
    },
  });
}

type DeleteCatalogIngredientArgs = {
  ingredientToSend: IngredientType;
};

async function deleteCatalogIngredient({
  ingredientToSend,
}: DeleteCatalogIngredientArgs) {
  try {
    const response = await axios.delete(
      `${API_PATHS.catalogIngredients}${ingredientToSend.name}/`
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw Error("Unknown error");
    }
  }
}

type UseDeleteCatalogIngredientArgs = {
  onSuccess: () => void;
  onFailure: (name: string) => void;
};

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
function useDeleteCatalogIngredient({
  onSuccess: handleSuccess,
  onFailure: handleFailure,
}: UseDeleteCatalogIngredientArgs) {
  const { cache, mutate } = useSWRConfig();
  const key = API_PATHS.catalogIngredients;
  return useMutation(deleteCatalogIngredient, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: IngredientType[]) => {
          const ingredientsListUpdated = produce(
            current,
            (draftState: IngredientType[]) => {
              const index = draftState.findIndex(
                (ingredient: IngredientType) => {
                  return ingredient.name === input.ingredientToSend.name;
                }
              );
              draftState.splice(index, 1);
            }
          );
          return ingredientsListUpdated;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      mutate(key);
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (handleFailure) handleFailure(input.ingredientToSend.name);
    },
  });
}

type DeleteCatalogRecipeArgs = {
  recipeToSend: CatalogRecipeType;
};

async function deleteCatalogRecipe({ recipeToSend }: DeleteCatalogRecipeArgs) {
  try {
    const response = await axios.delete(
      `${API_PATHS.catalogRecipes}${recipeToSend.id}/`
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw Error("Unknown error");
    }
  }
}

type UseDeleteCatalogRecipeArgs = UseDeleteCatalogIngredientArgs;

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
function useDeleteCatalogRecipe({
  onSuccess: handleSuccess,
  onFailure: handleFailure,
}: UseDeleteCatalogRecipeArgs) {
  const { cache, mutate } = useSWRConfig();
  const key = API_PATHS.catalogRecipes;
  return useMutation(deleteCatalogRecipe, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: CatalogRecipeType[]) => {
          const updatedRecipes = produce(
            current,
            (draftState: CatalogRecipeType[]) => {
              const index = draftState.findIndex(
                (recipe: CatalogRecipeType) => {
                  return recipe.id === input.recipeToSend.id;
                }
              );
              draftState.splice(index, 1);
            }
          );
          return updatedRecipes;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      mutate(key, (current: CatalogRecipeType[]) => current);
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (handleFailure)
        handleFailure(input.recipeToSend.id ? input.recipeToSend.id : "");
    },
  });
}

type DeleteFridgeIngredientArgs = {
  ingredientToSend: FridgeIngredientType;
};

async function deleteFridgeIngredient({
  ingredientToSend,
}: DeleteFridgeIngredientArgs) {
  try {
    const response = await axios.delete(
      `${API_PATHS.fridgeIngredients}${ingredientToSend.id}/`
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw Error("Unknown error");
    }
  }
}

type UseDeleteFridgeIngredientArgs = UseDeleteCatalogRecipeArgs;

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
function useDeleteFridgeIngredient({
  onSuccess: handleSuccess,
  onFailure: handleFailure,
}: UseDeleteFridgeIngredientArgs) {
  const { cache, mutate } = useSWRConfig();
  const key = API_PATHS.fridgeIngredients;
  return useMutation(deleteFridgeIngredient, {
    onMutate({ input }) {
      const oldData = cache.get(key);
      mutate(
        key,
        (current: FridgeIngredientType[]) => {
          const fridgeIngredientsUpdated = produce(
            current,
            (draftState: FridgeIngredientType[]) => {
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
      mutate(key, (current: FridgeIngredientType[]) => current);
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (handleFailure) handleFailure(input.ingredientToSend.id);
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
