from django.contrib import admin
from .models import Ingredient, IngredientRecette, Categorie, Recette

admin.site.register(Ingredient)
admin.site.register(IngredientRecette)
admin.site.register(Categorie)
admin.site.register(Recette)
