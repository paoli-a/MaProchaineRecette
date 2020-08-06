from typing import Dict

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
        fridge_ingredients = self._build_fridge_ingredients_data()
        recipes = Recette.objects.all()
        feasible_recipes = []
        for recipe in recipes:
            ingredients_available = True
            for recipe_ingredient in recipe.ingredients.all():
                name = recipe_ingredient.ingredient.nom
                unit_type = recipe_ingredient.unite.type.nom
                converted_quantity = recipe_ingredient.quantite * recipe_ingredient.unite.rapport
                if name in fridge_ingredients and unit_type in fridge_ingredients[name]:
                    if fridge_ingredients[name][unit_type] < converted_quantity:
                        ingredients_available = False
                else:
                    ingredients_available = False
            if ingredients_available:
                feasible_recipes.append(recipe)
        serializer = RecetteSerializer(feasible_recipes, many=True)
        return Response(serializer.data)

    @staticmethod
    def _build_fridge_ingredients_data() -> Dict[str, Dict[str, float]]:
        # Quantites are converted into the unit that has the ratio equal to 1
        data = {}
        for fridge_ingredient in IngredientFrigo.objects.all():
            name = fridge_ingredient.ingredient.nom
            unit_type = fridge_ingredient.unite.type.nom
            converted_quantity = fridge_ingredient.quantite * fridge_ingredient.unite.rapport
            if name not in data:
                data[name] = {unit_type: converted_quantity}
            else:
                if unit_type not in data[name]:
                    data[name][unit_type] = converted_quantity
                else:
                    data[name][unit_type] += converted_quantity
        return data
