from rest_framework import viewsets, permissions, authentication
from rest_framework.views import APIView
from rest_framework.response import Response

from frigo.models import IngredientFrigo
from catalogues.models import Recette
from frigo.serializers import IngredientFrigoSerializer
from catalogues.serializers import RecetteSerializer


class IngredientFrigoViewSet(viewsets.ModelViewSet):
    """Provides a CRUD API for fridge ingredients."""
    queryset = IngredientFrigo.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    serializer_class = IngredientFrigoSerializer


class RecettesFrigo(APIView):
    """View to list feasible recipes according to fridge ingredients."""
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    def get(self, request, format="json"):
        fridge_ingredients = IngredientFrigo.objects.all()
        recipes = Recette.objects.all()
        feasible_recipes = []
        for recipe in recipes:
            ingredients_available = True
            for recipe_ingredient in recipe.ingredients.all():
                ingredient_available = False
                for fridge_ingredient in fridge_ingredients:
                    if fridge_ingredient.ingredient == recipe_ingredient.ingredient:
                        if fridge_ingredient.quantite >= recipe_ingredient.quantite:
                            ingredient_available = True
                if not ingredient_available:
                    ingredients_available = False
            if ingredients_available:
                feasible_recipes.append(recipe)
        serializer = RecetteSerializer(feasible_recipes, many=True)
        return Response(serializer.data)
