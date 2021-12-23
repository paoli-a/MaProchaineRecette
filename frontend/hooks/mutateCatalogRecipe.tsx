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
  CatalogRecipeInMemory,
  CatalogRecipeReceived,
  CatalogRecipeToSend,
} from "../constants/types";

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

type UseAddCatalogRecipeArgs = {
  onSuccess: () => void;
  onFailure: () => void;
};

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
      let oldData: CatalogRecipeInMemory[] = [];
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
        (current: CatalogRecipeInMemory[]) => [...current, input.recipeToSend],
        false
      );
      return () => mutate(key, oldData, false);
    },
    onSuccess({ data }: { data: unknown }) {
      void mutate(key, (current: CatalogRecipeInMemory[]) =>
        current.map((recipe: CatalogRecipeInMemory) => {
          if (recipe.id) {
            return recipe;
          } else if (isCatalogRecipeResponse(data)) {
            return data.data;
          } else {
            throw new Error(
              `The data sent back by the backend ${JSON.stringify(
                data
              )} is not of type CatalogRecipeReceived`
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

type UseUpdateCatalogRecipeArgs = UseAddCatalogRecipeArgs;

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
      let oldData: CatalogRecipeInMemory[] = [];
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
        (current: CatalogRecipeInMemory[]) => {
          const updatedRecipes = produce(
            current,
            (draftState: CatalogRecipeInMemory[]) => {
              const index = draftState.findIndex(
                (recipe: CatalogRecipeInMemory) => {
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
    onSuccess({ data }: { data: unknown }) {
      void mutate(key, (current: CatalogRecipeInMemory[]) =>
        current.map((recipe: CatalogRecipeInMemory) => {
          if (isCatalogRecipeResponse(data)) {
            if (recipe.id === data.data.id) return data.data;
            else return recipe;
          } else {
            throw new Error(
              `The data sent back by the backend ${JSON.stringify(
                data
              )} is not of type CatalogRecipeReceived`
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

type DeleteCatalogRecipeArgs = {
  recipeToDeleteID: string;
};

async function deleteCatalogRecipe({
  recipeToDeleteID,
}: DeleteCatalogRecipeArgs) {
  if (recipeToDeleteID === undefined) {
    throw new Error(
      "You're trying to delete a catalog recipe with an undefined id"
    );
  }
  try {
    const response = await axios.delete(
      `${API_PATHS.catalogRecipes}${recipeToDeleteID}/`
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

type UseDeleteCatalogRecipeArgs = {
  onSuccess: () => void;
  onFailure: (name: string) => void;
};

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
      let oldData: CatalogRecipeInMemory[] = [];
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
        (current: CatalogRecipeInMemory[]) => {
          const updatedRecipes = produce(
            current,
            (draftState: CatalogRecipeInMemory[]) => {
              const index = draftState.findIndex(
                (recipe: CatalogRecipeInMemory) => {
                  return recipe.id === input.recipeToDeleteID;
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
      void mutate(key, (current: CatalogRecipeInMemory[]) => current);
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (handleFailure)
        handleFailure(input.recipeToDeleteID ? input.recipeToDeleteID : "");
    },
  });
}

export { useAddCatalogRecipe, useUpdateCatalogRecipe, useDeleteCatalogRecipe };
