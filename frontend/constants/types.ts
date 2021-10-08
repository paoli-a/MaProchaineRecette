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

export type { RecipeType, RecipeToSendType, RecipeIngredientType };
