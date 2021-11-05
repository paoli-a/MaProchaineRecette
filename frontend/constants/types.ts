interface RecipeType extends RecipeToSendType {
  priority_ingredients: string[];
  unsure_ingredients: string[];
}

type RecipeToSendType = {
  id?: string;
  categories: string[];
  title: string;
  ingredients: RecipeIngredientType[];
  duration: string;
  description: string;
};

type RecipeIngredientType = {
  ingredient: string;
  amount: string;
  unit: string;
};

interface SubmitRecipeDataType extends RecipeDataType {
  ingredients: RecipeIngredientType[];
}

type RecipeDataType = {
  recipeTitle: string;
  recipeTime: string;
  recipeDescription: string;
  categories: (string | boolean)[];
};

type FridgeIngredientType = {
  id: string;
  name: string;
  expirationDate: Date;
  amount: string;
  unit: string;
};

type SubmitFridgeIngredientDataType = {
  ingredientName: string;
  ingredientAmount: string;
  unit: string;
  expirationDate: string;
};

type IngredientType = {
  name: string;
};

export type {
  RecipeType,
  RecipeToSendType,
  RecipeIngredientType,
  FridgeIngredientType,
  IngredientType,
  SubmitRecipeDataType,
  RecipeDataType,
  SubmitFridgeIngredientDataType,
};
