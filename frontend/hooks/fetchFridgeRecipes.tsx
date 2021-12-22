import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";
import { isCorrectArrayResponse } from "../constants/typeGuards";
import { FridgeRecipe, FridgeRecipeReceived } from "../constants/types";

type UseFridgeRecipes = {
  fridgeRecipes: FridgeRecipe[];
  isFridgeRecipesLoading: boolean;
  isFridgeRecipesError: boolean;
};

function fetcherFridgeRecipes(url: string): Promise<FridgeRecipeReceived[]> {
  return axios.get(url).then((res): FridgeRecipeReceived[] => {
    if (
      isCorrectArrayResponse(res.data, (element: FridgeRecipeReceived) => {
        return (
          typeof element === "object" &&
          "categories" in element &&
          "title" in element &&
          "ingredients" in element &&
          "duration" in element &&
          "description" in element &&
          "priority_ingredients" in element &&
          "unsure_ingredients" in element
        );
      })
    ) {
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
