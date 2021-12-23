import { useCatalogIngredients } from "./fetchCatalogIngredients";
import { useCatalogRecipes } from "./fetchCatalogRecipes";
import { useCategories } from "./fetchCategories";
import { useFridgeIngredients } from "./fetchFridgeIngredients";
import { useFridgeRecipes } from "./fetchFridgeRecipes";
import { useUnits } from "./fetchUnits";
import {
  useAddCatalogIngredient,
  useDeleteCatalogIngredient,
} from "./mutateCatalogIngredient";
import {
  useAddCatalogRecipe,
  useDeleteCatalogRecipe,
  useUpdateCatalogRecipe,
} from "./mutateCatalogRecipe";
import { useDeleteFridgeIngredient } from "./mutateFridgeIngredient";

export {
  useDeleteFridgeIngredient,
  useAddCatalogRecipe,
  useUpdateCatalogRecipe,
  useDeleteCatalogRecipe,
  useAddCatalogIngredient,
  useDeleteCatalogIngredient,
  useCatalogIngredients,
  useCatalogRecipes,
  useFridgeIngredients,
  useCategories,
  useUnits,
  useFridgeRecipes,
};
