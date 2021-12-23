import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";
import { isCorrectArrayResponse } from "../constants/typeGuards";
import {
  CatalogRecipe,
  CatalogRecipeInMemory,
  CatalogRecipeReceived,
} from "../constants/types";

type UseCatalogRecipes = {
  catalogRecipes: CatalogRecipe[];
  isCatalogRecipesLoading: boolean;
  isCatalogRecipesError: boolean;
};

function fetcherCatalogRecipes(url: string): Promise<CatalogRecipeReceived[]> {
  return axios.get(url).then((res): CatalogRecipeReceived[] => {
    if (
      isCorrectArrayResponse(res.data, (element: CatalogRecipeReceived) => {
        return (
          typeof element === "object" &&
          "categories" in element &&
          "title" in element &&
          "ingredients" in element &&
          "duration" in element &&
          "description" in element
        );
      })
    ) {
      return res.data;
    } else {
      return [];
    }
  });
}

function useCatalogRecipes(
  fallbackData?: CatalogRecipeReceived[]
): UseCatalogRecipes {
  const { data, error } = useSWR<CatalogRecipeInMemory[], AxiosError<Error>>(
    API_PATHS.catalogRecipes,
    fetcherCatalogRecipes,
    {
      fallbackData: fallbackData,
    }
  );
  const catalogRecipes = data ? data : [];
  return {
    catalogRecipes: catalogRecipes,
    isCatalogRecipesLoading: !error && !data,
    isCatalogRecipesError: Boolean(error),
  };
}

export { useCatalogRecipes };
