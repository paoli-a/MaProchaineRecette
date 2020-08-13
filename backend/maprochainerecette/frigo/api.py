import datetime
from typing import Dict, Any

from rest_framework import viewsets, permissions, authentication
from rest_framework.views import APIView
from rest_framework.response import Response

from frigo.models import IngredientFrigo
from catalogues.models import Recette
from frigo.serializers import IngredientFrigoSerializer, RecetteFrigoSerializer


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
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    def get(self, request, format="json"):
        """View to list feasible recipes according to fridge ingredients."""
        fridge_ingredients = self._build_fridge_ingredients_data()
        recipes = Recette.objects.all()
        feasible_recipes = []
        unsure_ingredients: Dict[int, list] = {}
        priority_ingredients: Dict[int, list] = {}
        for recipe in recipes:
            ingredients_available = True
            priority_ingredient_date = None
            priority_ingredient = None
            for recipe_ingredient in recipe.ingredients.all():
                name = recipe_ingredient.ingredient.nom
                (ingredient_available,
                 ingredient_unsure,
                 ingredient_date) = self._check_ingredient_available(
                    recipe_ingredient, fridge_ingredients)
                if not ingredient_available:
                    ingredients_available = False
                else:
                    if not priority_ingredient_date or ingredient_date < priority_ingredient_date:
                        priority_ingredient_date = ingredient_date
                        priority_ingredient = name
                    if ingredient_unsure:
                        if recipe.id not in unsure_ingredients:
                            unsure_ingredients[recipe.id] = [name]
                        else:
                            unsure_ingredients[recipe.id] += [name]
                    else:
                        unsure_ingredients[recipe.id] = []
            if ingredients_available:
                feasible_recipes.append(recipe)
                if priority_ingredient:
                    priority_ingredients[recipe.id] = [priority_ingredient]
        serializer = RecetteFrigoSerializer(feasible_recipes, many=True, context={
                                            "unsure_ingredients": unsure_ingredients,
                                            "priority_ingredients": priority_ingredients})
        return Response(serializer.data)

    @staticmethod
    def _build_fridge_ingredients_data():
        # Quantites are converted into the unit that has the ratio equal to 1
        # For each iingredient and unit type, we keep only the erliest date
        data: Dict[str, Dict[str, Dict[str, Any]]] = {}
        # {name : {unit_type: {quantity or date: ingredient quantity or date}}}
        for fridge_ingredient in IngredientFrigo.objects.all():
            name = fridge_ingredient.ingredient.nom
            unit_type = fridge_ingredient.unite.type.nom
            date = fridge_ingredient.date_peremption
            converted_quantity = fridge_ingredient.quantite * fridge_ingredient.unite.rapport
            if name not in data:
                data[name] = {unit_type: {
                    "quantity": converted_quantity, "date": date}}
            else:
                if unit_type not in data[name]:
                    data[name][unit_type] = {
                        "quantity": converted_quantity, "date": date}
                else:
                    data[name][unit_type]["quantity"] += converted_quantity
                    data[name][unit_type]["date"] = min(
                        data[name][unit_type]["date"], date)
        return data

    @staticmethod
    def _check_ingredient_available(recipe_ingredient, fridge_ingredients):
        name = recipe_ingredient.ingredient.nom
        unit_type = recipe_ingredient.unite.type.nom
        converted_quantity = recipe_ingredient.quantite * recipe_ingredient.unite.rapport
        ingredient_available = True
        ingredient_unsure = False
        ingredient_date = None
        if name in fridge_ingredients:
            if unit_type in fridge_ingredients[name] and fridge_ingredients[name][unit_type]["quantity"] >= converted_quantity:
                ingredient_date = fridge_ingredients[name][unit_type]["date"]
            elif set(fridge_ingredients[name].keys()).difference({unit_type}):
                ingredient_unsure = True
                ingredient_date = min(
                    quantity_date["date"] for quantity_date in fridge_ingredients[name].values())
            else:
                ingredient_available = False
        else:
            ingredient_available = False
        return ingredient_available, ingredient_unsure, ingredient_date
