import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";
import { isCorrectArrayResponse } from "../constants/typeGuards";
import {
  CatalogRecipeType,
  FridgeIngredientType,
  IngredientType,
  RecipeType,
} from "../constants/types";

type UseCatalogIngredients = {
  catalogIngredients: IngredientType[];
  isCatalogIngredientsLoading: boolean;
  isCatalogIngredientsError: boolean;
};

type UseCatalogRecipes = {
  catalogRecipes: CatalogRecipeType[];
  isCatalogRecipesLoading: boolean;
  isCatalogRecipesError: boolean;
};

type UseFridgeIngredients = {
  fridgeIngredients: FridgeIngredientType[];
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
  fridgeRecipes: RecipeType[];
  isFridgeRecipesLoading: boolean;
  isFridgeRecipesError: boolean;
};

type FridgeIngredientBackendType = {
  id: string;
  ingredient: string;
  expiration_date: Date;
  amount: string;
  unit: string;
};

function fetcherCatalogIngredients(url: string): Promise<IngredientType[]> {
  return axios.get(url).then((res): IngredientType[] => {
    if (
      isCorrectArrayResponse(
        res.data,
        (element: IngredientType) =>
          typeof element === "object" && "name" in element
      )
    ) {
      return res.data;
    } else {
      return [];
    }
  });
}

function fetcherCatalogRecipes(url: string): Promise<CatalogRecipeType[]> {
  return axios.get(url).then((res): CatalogRecipeType[] => {
    if (
      isCorrectArrayResponse(res.data, (element: CatalogRecipeType) => {
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

function fetcherFridgeRecipes(url: string): Promise<RecipeType[]> {
  return axios.get(url).then((res): RecipeType[] => {
    if (
      isCorrectArrayResponse(res.data, (element: RecipeType) => {
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
): Promise<FridgeIngredientBackendType[]> {
  return axios.get(url).then((res): FridgeIngredientBackendType[] => {
    if (
      isCorrectArrayResponse(
        res.data,
        (element: FridgeIngredientBackendType) => {
          return (
            typeof element === "object" &&
            "id" in element &&
            "ingredient" in element &&
            "expiration_date" in element &&
            "amount" in element &&
            "unit" in element
          );
        }
      )
    ) {
      return res.data;
    } else {
      return [];
    }
  });
}

function useCatalogIngredients(
  fallbackData?: IngredientType[]
): UseCatalogIngredients {
  const { data, error } = useSWR<IngredientType[], AxiosError<Error>>(
    API_PATHS.catalogIngredients,
    fetcherCatalogIngredients,
    {
      fallbackData: fallbackData,
    }
  );
  const catalogIngredients = data ? data : [];
  return {
    catalogIngredients: catalogIngredients,
    isCatalogIngredientsLoading: !error && !data,
    isCatalogIngredientsError: Boolean(error),
  };
}

function useCatalogRecipes(
  fallbackData?: CatalogRecipeType[]
): UseCatalogRecipes {
  const { data, error } = useSWR<CatalogRecipeType[], AxiosError<Error>>(
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
  fallbackData?: FridgeIngredientBackendType[]
): UseFridgeIngredients {
  const { data, error } = useSWR<
    FridgeIngredientBackendType[],
    AxiosError<Error>
  >(API_PATHS.fridgeIngredients, fetcherFridgeIngredients, {
    fallbackData: fallbackData,
  });
  let fridgeIngredients: FridgeIngredientType[] = [];
  if (data) {
    fridgeIngredients = data.map(
      (fridgeIngredient: FridgeIngredientBackendType): FridgeIngredientType => {
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

function useFridgeRecipes(fallbackData?: RecipeType[]): UseFridgeRecipes {
  const { data, error } = useSWR<RecipeType[], AxiosError<Error>>(
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
