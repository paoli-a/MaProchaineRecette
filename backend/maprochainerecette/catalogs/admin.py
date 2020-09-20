from django.contrib import admin
from .models import Ingredient, RecipeIngredient, Category, Recipe

admin.site.register(Ingredient)
admin.site.register(RecipeIngredient)
admin.site.register(Category)
admin.site.register(Recipe)
