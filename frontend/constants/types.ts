type SuggestionElement = { name: string };

type CatalogIngredient = {
  name: string;
};
type CatalogIngredientReceived = CatalogIngredient;
type CatalogIngredientToSend = CatalogIngredient;
type CatalogIngredientInMemory =
  | CatalogIngredientReceived
  | CatalogIngredientToSend;

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
type CatalogRecipeInMemory = CatalogRecipeToSend | CatalogRecipeReceived;

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
  id?: string;
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
type FridgeIngredientInMemory =
  | FridgeIngredientToSend
  | FridgeIngredientReceived;

export type {
  SuggestionElement,
  RecipeIngredient,
  FridgeRecipe,
  FridgeRecipeReceived,
  CatalogRecipe,
  CatalogRecipeReceived,
  CatalogRecipeToSend,
  CatalogRecipeInMemory,
  CatalogIngredient,
  CatalogIngredientReceived,
  CatalogIngredientToSend,
  CatalogIngredientInMemory,
  FridgeIngredient,
  FridgeIngredientToSend,
  FridgeIngredientReceived,
  FridgeIngredientInMemory,
};
