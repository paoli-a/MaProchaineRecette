import {
  CatalogIngredientInMemory,
  CatalogRecipeInMemory,
  CatalogRecipeReceived,
  FridgeIngredientInMemory,
  FridgeIngredientReceived,
  FridgeRecipeReceived,
} from "./types";

function isCorrectArrayResponse<ArrayElementType>(
  response: unknown,
  checkDeeper: (arrayElement: ArrayElementType) => boolean
): response is ArrayElementType[] {
  if (!Array.isArray(response)) {
    return false;
  }
  if (
    response.some((element: ArrayElementType) => {
      return !checkDeeper(element);
    })
  ) {
    return false;
  }

  return true;
}

function isCatalogRecipe(recipe: unknown): recipe is CatalogRecipeInMemory {
  return (
    recipe !== null &&
    typeof recipe === "object" &&
    "categories" in recipe &&
    "title" in recipe &&
    "ingredients" in recipe &&
    "duration" in recipe &&
    "description" in recipe
  );
}
function isCatalogRecipes(data: unknown): data is CatalogRecipeInMemory[] {
  return isCorrectArrayResponse(data, (element: CatalogRecipeInMemory) =>
    isCatalogRecipe(element)
  );
}
function isCatalogRecipesResponse(
  data: unknown
): data is CatalogRecipeReceived[] {
  return isCorrectArrayResponse(data, (element: CatalogRecipeReceived) => {
    return isCatalogRecipe(element) && "id" in element;
  });
}
function isCatalogRecipeResponse(data: unknown): data is CatalogRecipeReceived {
  return isCatalogRecipe(data) && "id" in data;
}

function ckeckCatalogIngredientShape(
  ingredient: CatalogIngredientInMemory
): boolean {
  return typeof ingredient === "object" && "name" in ingredient;
}
function isCatalogIngredients(
  data: unknown
): data is CatalogIngredientInMemory[] {
  return isCorrectArrayResponse(data, (element: CatalogIngredientInMemory) =>
    ckeckCatalogIngredientShape(element)
  );
}

function ckeckFridgeIngredientShape(
  ingredient: FridgeIngredientInMemory
): boolean {
  return (
    typeof ingredient === "object" &&
    "id" in ingredient &&
    "ingredient" in ingredient &&
    "expiration_date" in ingredient &&
    "amount" in ingredient &&
    "unit" in ingredient
  );
}
function isFridgeIngredients(
  data: unknown
): data is FridgeIngredientInMemory[] {
  return isCorrectArrayResponse(data, (element: FridgeIngredientInMemory) =>
    ckeckFridgeIngredientShape(element)
  );
}
function isFridgeIngredientsResponse(
  data: unknown
): data is FridgeIngredientReceived[] {
  return isCorrectArrayResponse(data, (element: FridgeIngredientReceived) => {
    return ckeckFridgeIngredientShape(element) && "id" in element;
  });
}

function ckeckFridgeRecipeShape(recipe: FridgeRecipeReceived): boolean {
  return (
    typeof recipe === "object" &&
    "categories" in recipe &&
    "title" in recipe &&
    "ingredients" in recipe &&
    "duration" in recipe &&
    "description" in recipe &&
    "priority_ingredients" in recipe &&
    "unsure_ingredients" in recipe
  );
}
function isFridgeRecipesResponse(
  data: unknown
): data is FridgeRecipeReceived[] {
  return isCorrectArrayResponse(data, (element: FridgeRecipeReceived) => {
    return ckeckFridgeRecipeShape(element) && "id" in element;
  });
}

export {
  isCorrectArrayResponse,
  isCatalogRecipes,
  isCatalogRecipesResponse,
  isCatalogRecipeResponse,
  isCatalogIngredients,
  isFridgeIngredients,
  isFridgeIngredientsResponse,
  isFridgeRecipesResponse,
};
