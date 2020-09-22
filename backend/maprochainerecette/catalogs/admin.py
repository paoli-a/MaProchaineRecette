from django.contrib import admin

from .models import Category, Ingredient, Recipe, RecipeIngredient

admin.site.register(Ingredient)
admin.site.register(RecipeIngredient)
admin.site.register(Category)
admin.site.register(Recipe)
