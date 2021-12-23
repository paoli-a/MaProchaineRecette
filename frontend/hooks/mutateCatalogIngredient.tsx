import axios from "axios";
import produce from "immer";
import { useSWRConfig } from "swr";
import useMutation from "use-mutation";
import { API_PATHS } from "../constants/paths";
import { isCorrectArrayResponse } from "../constants/typeGuards";
import {
  CatalogIngredientInMemory,
  CatalogIngredientReceived,
  CatalogIngredientToSend,
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
      let oldData: CatalogIngredientInMemory[] = [];
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
        (current: CatalogIngredientInMemory[]) => [
          ...current,
          input.ingredientToSend,
        ],
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

type DeleteCatalogIngredientArgs = {
  ingredientToDeleteName: string;
};

async function deleteCatalogIngredient({
  ingredientToDeleteName,
}: DeleteCatalogIngredientArgs) {
  try {
    const response = await axios.delete(
      `${API_PATHS.catalogIngredients}${ingredientToDeleteName}/`
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
      let oldData: CatalogIngredientInMemory[] = [];
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
        (current: CatalogIngredientInMemory[]) => {
          const ingredientsListUpdated = produce(
            current,
            (draftState: CatalogIngredientInMemory[]) => {
              const index = draftState.findIndex(
                (ingredient: CatalogIngredientInMemory) => {
                  return ingredient.name === input.ingredientToDeleteName;
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
      if (handleFailure) handleFailure(input.ingredientToDeleteName);
    },
  });
}

export { useAddCatalogIngredient, useDeleteCatalogIngredient };
