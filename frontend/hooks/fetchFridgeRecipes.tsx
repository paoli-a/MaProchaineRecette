import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";
import { isFridgeRecipesResponse } from "../constants/typeGuards";
import { FridgeRecipe, FridgeRecipeReceived } from "../constants/types";

type UseFridgeRecipes = {
  fridgeRecipes: FridgeRecipe[];
  isFridgeRecipesLoading: boolean;
  isFridgeRecipesError: boolean;
};

function fetcherFridgeRecipes(url: string): Promise<FridgeRecipeReceived[]> {
  return axios.get(url).then((res): FridgeRecipeReceived[] => {
    if (isFridgeRecipesResponse(res.data)) {
      return res.data;
    } else {
      return [];
    }
  });
}

function useFridgeRecipes(
  fallbackData?: FridgeRecipeReceived[]
): UseFridgeRecipes {
  const { data, error } = useSWR<FridgeRecipeReceived[], AxiosError<Error>>(
    API_PATHS.fridgeRecipes,
    fetcherFridgeRecipes,
    {
      fallbackData: fallbackData,
    }
  );
  const recipes = data ? data : [];
  return {
    fridgeRecipes: recipes,
    isFridgeRecipesLoading: !error && !data,
    isFridgeRecipesError: Boolean(error),
  };
}

export { useFridgeRecipes };
