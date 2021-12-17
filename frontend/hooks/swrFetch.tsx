import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";
import { isCorrectArrayResponse } from "../constants/typeGuards";
import {
  CatalogIngredient,
  CatalogIngredientReceived,
  CatalogRecipe,
  CatalogRecipeReceived,
  FridgeIngredient,
  FridgeIngredientReceived,
  FridgeRecipe,
  FridgeRecipeReceived,
} from "../constants/types";

type UseCatalogIngredients = {
  catalogIngredients: CatalogIngredient[];
  isCatalogIngredientsLoading: boolean;
  isCatalogIngredientsError: boolean;
};

type UseCatalogRecipes = {
  catalogRecipes: CatalogRecipe[];
  isCatalogRecipesLoading: boolean;
  isCatalogRecipesError: boolean;
};

type UseFridgeIngredients = {
  fridgeIngredients: FridgeIngredient[];
  isFridgeIngredientsLoading: boolean;
  isFridgeIngredientsError: boolean;
};

type UseCategories = {
  categories: string[];
  isCategoriesLoading: boolean;
  isCategoriesError: boolean;
};

type UseUnits = {
  units: string[];
  isUnitsLoading: boolean;
  isUnitsError: boolean;
};

type UseFridgeRecipes = {
  fridgeRecipes: FridgeRecipe[];
  isFridgeRecipesLoading: boolean;
  isFridgeRecipesError: boolean;
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

function fetcherArrayOfStrings(url: string): Promise<string[]> {
  return axios.get(url).then((res): string[] => {
    if (isCorrectArrayResponse(res.data, (element: string) => true)) {
      return res.data;
    } else {
      return [];
    }
  });
}

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

function useCatalogIngredients(
  fallbackData?: CatalogIngredientReceived[]
): UseCatalogIngredients {
  const { data, error } = useSWR<
    CatalogIngredientReceived[],
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

function useCatalogRecipes(
  fallbackData?: CatalogRecipeReceived[]
): UseCatalogRecipes {
  const { data, error } = useSWR<CatalogRecipeReceived[], AxiosError<Error>>(
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

function useCategories(fallbackData?: string[]): UseCategories {
  const { data, error } = useSWR<string[], AxiosError<Error>>(
    API_PATHS.catalogCategories,
    fetcherArrayOfStrings,
    {
      fallbackData: fallbackData,
    }
  );
  const categories = data ? data : [];
  return {
    categories: categories,
    isCategoriesLoading: !error && !data,
    isCategoriesError: Boolean(error),
  };
}

function useUnits(fallbackData?: string[]): UseUnits {
  const { data, error } = useSWR<string[], AxiosError<Error>>(
    API_PATHS.units,
    fetcherArrayOfStrings,
    {
      fallbackData: fallbackData,
    }
  );
  const units = data ? data : [];
  return {
    units: units,
    isUnitsLoading: !error && !data,
    isUnitsError: Boolean(error),
  };
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

export {
  useCatalogIngredients,
  useCatalogRecipes,
  useFridgeIngredients,
  useCategories,
  useUnits,
  useFridgeRecipes,
};
