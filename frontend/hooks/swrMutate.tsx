import axios from "axios";
import produce from "immer";
import { useSWRConfig } from "swr";
import useMutation from "use-mutation";
import { API_PATHS } from "../constants/paths";
import {
  isCatalogRecipeResponse,
  isCorrectArrayResponse,
} from "../constants/typeGuards";
import {
  CatalogIngredient,
  CatalogIngredientReceived,
  CatalogIngredientToSend,
  CatalogRecipe,
  CatalogRecipeReceived,
  CatalogRecipeToSend,
  FridgeIngredient,
  FridgeIngredientReceived,
} from "../constants/types";

type AddCatalogIngredientArgs = {
  ingredientToSend: CatalogIngredientToSend;
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
      const uncheckedData: unknown = cache.get(key);
      let oldData: CatalogIngredientReceived[] = [];
      if (
        isCorrectArrayResponse(
          uncheckedData,
          (element: CatalogIngredientReceived) =>
            typeof element === "object" && "name" in element
        )
      ) {
        oldData = uncheckedData;
      }
      void mutate(
        key,
        (current: CatalogIngredient[]) => [...current, input.ingredientToSend],
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess() {
      void mutate(key);
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback }) {
      if (rollback) rollback();
      if (handleFailure) handleFailure();
    },
  });
}

type AddCatalogRecipeArgs = {
  recipeToSend: CatalogRecipeToSend;
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
      const uncheckedData: unknown = cache.get(key);
      let oldData: CatalogRecipeReceived[] = [];
      if (
        isCorrectArrayResponse(
          uncheckedData,
          (element: CatalogRecipeReceived) => {
            return (
              typeof element === "object" &&
              "categories" in element &&
              "title" in element &&
              "ingredients" in element &&
              "duration" in element &&
              "description" in element
            );
          }
        )
      ) {
        oldData = uncheckedData;
      }
      void mutate(
        key,
        (current: CatalogRecipe[]) => [...current, input.recipeToSend],
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }: { data: unknown }) {
      void mutate(key, (current: CatalogRecipe[]) =>
        current.map((recipe: CatalogRecipe) => {
          if (recipe.id) {
            return recipe;
          } else if (isCatalogRecipeResponse(data)) {
            return data.data;
          } else {
            throw new Error(
              `The data sent back by the backend ${JSON.stringify(
                data
              )} is not of type CatalogRecipe`
            );
          }
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
  recipeToSend: CatalogRecipeToSend;
};

async function updateCatalogRecipe({ recipeToSend }: UpdateCatalogRecipeArgs) {
  if (recipeToSend.id === undefined) {
    throw new Error(
      "You're trying to update a catalog recipe with an undefined id"
    );
  }
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
      const uncheckedData: unknown = cache.get(key);
      let oldData: CatalogRecipeReceived[] = [];
      if (
        isCorrectArrayResponse(
          uncheckedData,
          (element: CatalogRecipeReceived) => {
            return (
              typeof element === "object" &&
              "categories" in element &&
              "title" in element &&
              "ingredients" in element &&
              "duration" in element &&
              "description" in element
            );
          }
        )
      ) {
        oldData = uncheckedData;
      }
      void mutate(
        key,
        (current: CatalogRecipe[]) => {
          const updatedRecipes = produce(
            current,
            (draftState: CatalogRecipe[]) => {
              const index = draftState.findIndex((recipe: CatalogRecipe) => {
                return recipe.id === input.recipeToSend.id;
              });
              draftState.splice(index, 1, input.recipeToSend);
            }
          );
          return updatedRecipes;
        },
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }: { data: unknown }) {
      void mutate(key, (current: CatalogRecipe[]) =>
        current.map((recipe: CatalogRecipe) => {
          if (isCatalogRecipeResponse(data)) {
            if (recipe.id === data.data.id) return data.data;
            else return recipe;
          } else {
            throw new Error(
              `The data sent back by the backend ${JSON.stringify(
                data
              )} is not of type CatalogRecipe`
            );
          }
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
  ingredientToSend: CatalogIngredientToSend;
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
      const uncheckedData: unknown = cache.get(key);
      let oldData: CatalogIngredientReceived[] = [];
      if (
        isCorrectArrayResponse(
          uncheckedData,
          (element: CatalogIngredientReceived) =>
            typeof element === "object" && "name" in element
        )
      ) {
        oldData = uncheckedData;
      }
      void mutate(
        key,
        (current: CatalogIngredient[]) => {
          const ingredientsListUpdated = produce(
            current,
            (draftState: CatalogIngredient[]) => {
              const index = draftState.findIndex(
                (ingredient: CatalogIngredient) => {
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
      void mutate(key);
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (handleFailure) handleFailure(input.ingredientToSend.name);
    },
  });
}

type DeleteCatalogRecipeArgs = {
  recipeToSend: CatalogRecipeToSend;
};

async function deleteCatalogRecipe({ recipeToSend }: DeleteCatalogRecipeArgs) {
  if (recipeToSend.id === undefined) {
    throw new Error(
      "You're trying to delete a catalog recipe with an undefined id"
    );
  }
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
      const uncheckedData: unknown = cache.get(key);
      let oldData: CatalogRecipeReceived[] = [];
      if (
        isCorrectArrayResponse(
          uncheckedData,
          (element: CatalogRecipeReceived) => {
            return (
              typeof element === "object" &&
              "categories" in element &&
              "title" in element &&
              "ingredients" in element &&
              "duration" in element &&
              "description" in element
            );
          }
        )
      ) {
        oldData = uncheckedData;
      }
      void mutate(
        key,
        (current: CatalogRecipe[]) => {
          const updatedRecipes = produce(
            current,
            (draftState: CatalogRecipe[]) => {
              const index = draftState.findIndex((recipe: CatalogRecipe) => {
                return recipe.id === input.recipeToSend.id;
              });
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
      void mutate(key, (current: CatalogRecipe[]) => current);
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
  ingredientToDeleteID: string;
};

async function deleteFridgeIngredient({
  ingredientToDeleteID,
}: DeleteFridgeIngredientArgs) {
  try {
    const response = await axios.delete(
      `${API_PATHS.fridgeIngredients}${ingredientToDeleteID}/`
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
      const uncheckedData: unknown = cache.get(key);
      let oldData: FridgeIngredientReceived[] = [];
      if (
        isCorrectArrayResponse(
          uncheckedData,
          (element: FridgeIngredientReceived) => {
            return (
              typeof element === "object" &&
              "id" in element &&
              "ingredient" in element &&
              "expiration_date" in element &&
              "amount" in element &&
              "unit" in element
            );
          }
        )
      ) {
        oldData = uncheckedData;
      }
      void mutate(
        key,
        (current: FridgeIngredient[]) => {
          const fridgeIngredientsUpdated = produce(
            current,
            (draftState: FridgeIngredient[]) => {
              const index = draftState.findIndex(
                (ingredient: FridgeIngredient) => {
                  return ingredient.id === input.ingredientToDeleteID;
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
      void mutate(key, (current: FridgeIngredient[]) => current);
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (handleFailure) handleFailure(input.ingredientToDeleteID);
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
