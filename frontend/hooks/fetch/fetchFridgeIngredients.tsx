import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../../constants/paths";
import { isFridgeIngredientsResponse } from "../../constants/typeGuards";
import {
  FridgeIngredient,
  FridgeIngredientInMemory,
  FridgeIngredientReceived,
} from "../../constants/types";

type UseFridgeIngredients = {
  fridgeIngredients: FridgeIngredient[];
  isFridgeIngredientsLoading: boolean;
  isFridgeIngredientsError: boolean;
};

function fetcherFridgeIngredients(
  url: string
): Promise<FridgeIngredientReceived[]> {
  return axios.get(url).then((res): FridgeIngredientReceived[] => {
    if (isFridgeIngredientsResponse(res.data)) {
      return res.data;
    } else {
      return [];
    }
  });
}

function useFridgeIngredients(
  fallbackData?: FridgeIngredientReceived[]
): UseFridgeIngredients {
  const { data, error } = useSWR<FridgeIngredientInMemory[], AxiosError<Error>>(
    API_PATHS.fridgeIngredients,
    fetcherFridgeIngredients,
    {
      fallbackData: fallbackData,
    }
  );
  let fridgeIngredients: FridgeIngredient[] = [];
  if (data) {
    fridgeIngredients = data.map(
      (fridgeIngredient: FridgeIngredientInMemory): FridgeIngredient => {
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
