import axios from "axios";
import useSWR from "swr";
import { API_PATHS } from "../constants/paths";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function useCatalogIngredients(initialData?: any) {
  const { data, error } = useSWR(API_PATHS.catalogIngredients, fetcher, {
    initialData: initialData,
  });
  let catalogIngredients = data ? data : [];
  return {
    catalogIngredients: catalogIngredients,
    isCatalogIngredientsLoading: !error && !data,
    isCatalogIngredientsError: error,
  };
}

function useCatalogRecipes(initialData?: any) {
  const { data, error } = useSWR(API_PATHS.catalogRecipes, fetcher, {
    initialData: initialData,
  });
  let catalogRecipes = data ? data : [];
  return {
    catalogRecipes: catalogRecipes,
    isCatalogRecipesLoading: !error && !data,
    isCatalogRecipesError: error,
  };
}

function useFridgeIngredients(initialData?: any) {
  const { data, error } = useSWR(API_PATHS.fridgeIngredients, fetcher, {
    initialData: initialData,
  });
  let fridgeIngredients = [];
  if (data) {
    fridgeIngredients = data.map((fridgeIngredient) => {
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

function useCategories(initialData?: any) {
  const { data, error } = useSWR(API_PATHS.catalogCategories, fetcher, {
    initialData: initialData,
  });
  let categories = data ? data : [];
  return {
    categories: categories,
    isCategoriesLoading: !error && !data,
    isCategoriesError: error,
  };
}

function useUnits(initialData?: any) {
  const { data, error } = useSWR(API_PATHS.units, fetcher, {
    initialData: initialData,
  });
  let units = data ? data : [];
  return {
    units: units,
    isUnitsLoading: !error && !data,
    isUnitsError: error,
  };
}

function useFridgeRecipes(initialData?: any) {
  const { data, error } = useSWR(API_PATHS.fridgeRecipes, fetcher, {
    initialData: initialData,
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
