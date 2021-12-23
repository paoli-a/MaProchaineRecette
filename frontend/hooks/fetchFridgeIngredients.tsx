import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";
import { isCorrectArrayResponse } from "../constants/typeGuards";
import { FridgeIngredient, FridgeIngredientReceived } from "../constants/types";

type UseFridgeIngredients = {
  fridgeIngredients: FridgeIngredient[];
  isFridgeIngredientsLoading: boolean;
  isFridgeIngredientsError: boolean;
};

function fetcherFridgeIngredients(
  url: string
): Promise<FridgeIngredientReceived[]> {
  return axios.get(url).then((res): FridgeIngredientReceived[] => {
    if (
      isCorrectArrayResponse(res.data, (element: FridgeIngredientReceived) => {
        return (
          typeof element === "object" &&
          "id" in element &&
          "ingredient" in element &&
          "expiration_date" in element &&
          "amount" in element &&
          "unit" in element
        );
      })
    ) {
      return res.data;
    } else {
      return [];
    }
  });
}

function useFridgeIngredients(
  fallbackData?: FridgeIngredientReceived[]
): UseFridgeIngredients {
  const { data, error } = useSWR<FridgeIngredientReceived[], AxiosError<Error>>(
    API_PATHS.fridgeIngredients,
    fetcherFridgeIngredients,
    {
      fallbackData: fallbackData,
    }
  );
  let fridgeIngredients: FridgeIngredient[] = [];
  if (data) {
    fridgeIngredients = data.map(
      (fridgeIngredient: FridgeIngredientReceived): FridgeIngredient => {
        return {
          id: fridgeIngredient.id,
          name: fridgeIngredient.ingredient,
          expirationDate: new Date(fridgeIngredient.expiration_date),
          amount: fridgeIngredient.amount,
          unit: fridgeIngredient.unit,
        };
      }
    );
  }
  return {
    fridgeIngredients: fridgeIngredients,
    isFridgeIngredientsLoading: !error && !data,
    isFridgeIngredientsError: Boolean(error),
  };
}

export { useFridgeIngredients };
