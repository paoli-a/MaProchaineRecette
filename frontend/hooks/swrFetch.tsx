import axios from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";

const fetcher = (url: any) => axios.get(url).then((res) => res.data);

function useCatalogIngredients(fallbackData?: any) {
  const { data, error } = useSWR(API_PATHS.catalogIngredients, fetcher, {
    fallbackData: fallbackData,
  });
  let catalogIngredients = data ? data : [];
  return {
    catalogIngredients: catalogIngredients,
    isCatalogIngredientsLoading: !error && !data,
    isCatalogIngredientsError: error,
  };
}

function useCatalogRecipes(fallbackData?: any) {
  const { data, error } = useSWR(API_PATHS.catalogRecipes, fetcher, {
    fallbackData: fallbackData,
  });
  let catalogRecipes = data ? data : [];
  return {
    catalogRecipes: catalogRecipes,
    isCatalogRecipesLoading: !error && !data,
    isCatalogRecipesError: error,
  };
}

function useFridgeIngredients(fallbackData?: any) {
  const { data, error } = useSWR(API_PATHS.fridgeIngredients, fetcher, {
    fallbackData: fallbackData,
  });
  let fridgeIngredients = [];
  if (data) {
    fridgeIngredients = data.map((fridgeIngredient: any) => {
      return {
        id: fridgeIngredient.id,
        name: fridgeIngredient.ingredient,
        expirationDate: new Date(fridgeIngredient.expiration_date),
        amount: fridgeIngredient.amount,
        unit: fridgeIngredient.unit,
      };
    });
  }
  return {
    fridgeIngredients: fridgeIngredients,
    isFridgeIngredientsLoading: !error && !data,
    isFridgeIngredientsError: error,
  };
}

function useCategories(fallbackData?: any) {
  const { data, error } = useSWR(API_PATHS.catalogCategories, fetcher, {
    fallbackData: fallbackData,
  });
  let categories = data ? data : [];
  return {
    categories: categories,
    isCategoriesLoading: !error && !data,
    isCategoriesError: error,
  };
}

function useUnits(fallbackData?: any) {
  const { data, error } = useSWR(API_PATHS.units, fetcher, {
    fallbackData: fallbackData,
  });
  let units = data ? data : [];
  return {
    units: units,
    isUnitsLoading: !error && !data,
    isUnitsError: error,
  };
}

function useFridgeRecipes(fallbackData?: any) {
  const { data, error } = useSWR(API_PATHS.fridgeRecipes, fetcher, {
    fallbackData: fallbackData,
  });
  let recipes = data ? data : [];
  return {
    fridgeRecipes: recipes,
    isFridgeRecipesLoading: !error && !data,
    isfridgeRecipesError: error,
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
