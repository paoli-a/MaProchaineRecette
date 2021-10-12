export const API_PATHS = Object.freeze({
  catalogIngredients: "/api/catalogs/ingredients/",
  catalogRecipes: "/api/catalogs/recipes/",
  catalogCategories: "/api/catalogs/categories/",
  fridgeIngredients: "/api/fridge/ingredients/",
  fridgeRecipes: "/api/fridge/recipes/",
  units: "/api/units/units/",
  consume: function createConsumePath(recipeId: string) {
    return `api/fridge/recipes/${recipeId}/consume/`;
  },
});
