import axios, { AxiosResponse } from "axios";
import produce from "immer";
import { useSWRConfig } from "swr";
import useMutation from "use-mutation";
import { API_PATHS } from "../constants/paths";
import { isFridgeIngredients } from "../constants/typeGuards";
import {
  FridgeIngredientInMemory,
  FridgeIngredientReceived,
} from "../constants/types";

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

type UseDeleteFridgeIngredientArgs = {
  onSuccess: () => void;
  onFailure: (name: string) => void;
};

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
  return useMutation<
    DeleteFridgeIngredientArgs,
    AxiosResponse<FridgeIngredientReceived>
  >(deleteFridgeIngredient, {
    onMutate({ input }) {
      const uncheckedData: unknown = cache.get(key);
      let oldData: FridgeIngredientInMemory[] = [];
      if (isFridgeIngredients(uncheckedData)) {
        oldData = uncheckedData;
      }
      void mutate(
        key,
        (current: FridgeIngredientInMemory[]) => {
          const fridgeIngredientsUpdated = produce(
            current,
            (draftState: FridgeIngredientInMemory[]) => {
              const index = draftState.findIndex(
                (ingredient: FridgeIngredientInMemory) => {
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
      return () => {
        void mutate(key, oldData, false);
      };
    },
    onSuccess() {
      void mutate(key, (current: FridgeIngredientInMemory[]) => current);
      if (handleSuccess) handleSuccess();
    },
    onFailure({ rollback, input }) {
      if (rollback) rollback();
      if (handleFailure) handleFailure(input.ingredientToDeleteID);
    },
  });
}

export { useDeleteFridgeIngredient };
