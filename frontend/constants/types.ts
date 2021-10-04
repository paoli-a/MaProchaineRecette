type RecipeType = {
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

export type { RecipeType, RecipeIngredientType };
