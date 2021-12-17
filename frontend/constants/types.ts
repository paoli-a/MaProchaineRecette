type SuggestionElement = { name: string };

type CatalogIngredient = {
  name: string;
};
type CatalogIngredientReceived = CatalogIngredient;
type CatalogIngredientToSend = CatalogIngredient;

type RecipeIngredient = {
  ingredient: string;
  amount: string;
  unit: string;
};

type CatalogRecipe = {
  id?: string;
  categories: string[];
  title: string;
  ingredients: RecipeIngredient[];
  duration: string;
  description: string;
};
type CatalogRecipeReceived = {
  id: string;
  title: string;
  description: string;
  duration: string;
  ingredients: RecipeIngredient[];
  categories: string[];
};
type CatalogRecipeToSend = CatalogRecipe;

interface FridgeRecipe extends FridgeRecipeToSend {
  priority_ingredients: string[];
  unsure_ingredients: string[];
}
interface FridgeRecipeReceived extends CatalogRecipeReceived {
  priority_ingredients: string[];
  unsure_ingredients: string[];
}
type FridgeRecipeToSend = CatalogRecipeToSend;

type FridgeIngredient = {
  id: string;
  name: string;
  expirationDate: Date;
  amount: string;
  unit: string;
};
type FridgeIngredientReceived = {
  id: string;
  ingredient: string;
  expiration_date: string;
  amount: string;
  unit: string;
};
type FridgeIngredientToSend = {
  id?: string;
  ingredient: string;
  expiration_date: string;
  amount: string;
  unit: string;
};

export type {
  FridgeRecipe,
  FridgeRecipeReceived,
  CatalogRecipe,
  CatalogRecipeReceived,
  CatalogRecipeToSend,
  RecipeIngredient,
  FridgeIngredient,
  CatalogIngredient,
  CatalogIngredientReceived,
  CatalogIngredientToSend,
  FridgeIngredientToSend,
  FridgeIngredientReceived,
  SuggestionElement,
};
