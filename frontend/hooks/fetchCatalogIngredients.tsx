import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";
import { isCorrectArrayResponse } from "../constants/typeGuards";
import {
  CatalogIngredient,
  CatalogIngredientInMemory,
  CatalogIngredientReceived,
} from "../constants/types";

type UseCatalogIngredients = {
  catalogIngredients: CatalogIngredient[];
  isCatalogIngredientsLoading: boolean;
  isCatalogIngredientsError: boolean;
};

function fetcherCatalogIngredients(
  url: string
): Promise<CatalogIngredientReceived[]> {
  return axios.get(url).then((res): CatalogIngredientReceived[] => {
    if (
      isCorrectArrayResponse(
        res.data,
        (element: CatalogIngredientReceived) =>
          typeof element === "object" && "name" in element
      )
    ) {
      return res.data;
    } else {
      return [];
    }
  });
}

function useCatalogIngredients(
  fallbackData?: CatalogIngredientReceived[]
): UseCatalogIngredients {
  const { data, error } = useSWR<
    CatalogIngredientInMemory[],
    AxiosError<Error>
  >(API_PATHS.catalogIngredients, fetcherCatalogIngredients, {
    fallbackData: fallbackData,
  });
  const catalogIngredients = data ? data : [];
  return {
    catalogIngredients: catalogIngredients,
    isCatalogIngredientsLoading: !error && !data,
    isCatalogIngredientsError: Boolean(error),
  };
}

export { useCatalogIngredients };
