import axios from "axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function useCatalogIngredients(initialData) {
  const { data, error } = useSWR("/api/catalogs/ingredients/", fetcher, {
    initialData: initialData,
  });
  let catalogIngredients = data ? data : [];
  return {
    catalogIngredients: catalogIngredients,
    isCatalogIngredientsLoading: !error && !data,
    isCatalogIngredientsError: error,
  };
}

function useCatalogRecipes(initialData) {
  const { data, error } = useSWR("/api/catalogs/recipes/", fetcher, {
    initialData: initialData,
  });
  let catalogRecipes = data ? data : [];
  return {
    catalogRecipes: catalogRecipes,
    isCatalogRecipesLoading: !error && !data,
    isCatalogRecipesError: error,
  };
}

function useFridgeIngredients(initialData) {
  const { data, error } = useSWR("/api/fridge/ingredients/", fetcher, {
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

function useCategories(initialData) {
  const { data, error } = useSWR("/api/catalogs/categories/", fetcher, {
    initialData: initialData,
  });
  let categories = data ? data : [];
  return {
    categories: categories,
    isCategoriesLoading: !error && !data,
    isCategoriesError: error,
  };
}

function useUnits(initialData) {
  const { data, error } = useSWR("/api/units/units/", fetcher, {
    initialData: initialData,
  });
  let units = data ? data : [];
  return {
    units: units,
    isUnitsLoading: !error && !data,
    isUnitsError: error,
  };
}

function useFridgeRecipes(initialData) {
  const { data, error } = useSWR("/api/fridge/recipes/", fetcher, {
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
