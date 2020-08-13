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

    def get(self, request):
        """View to list feasible recipes according to fridge ingredients."""
        fridge_ingredients = self._build_fridge_ingredients_data()
        recipes = Recette.objects.all()
        feasible_recipes = []
        unsure_ingredients: Dict[int, list] = {}
        priority_ingredients: Dict[int, list] = {}
        for recipe in recipes:
            ingredients_available = True
            priority_ingredient_date = None
            for recipe_ingredient in recipe.ingredients.all():
                name = recipe_ingredient.ingredient.nom
                (ingredient_available,
                 ingredient_unsure,
                 ingredient_date) = self._check_recipe_ingredient_against_fridge(
                    recipe_ingredient, fridge_ingredients)
                if not ingredient_available:
                    ingredients_available = False
                else:
                    priority_ingredients, priority_ingredient_date = self._build_priority_ingredients_field(
                        recipe.id, name, ingredient_date, priority_ingredient_date, priority_ingredients)
                    unsure_ingredients = self._build_unsure_ingredients_field(
                        recipe.id, name, ingredient_unsure, unsure_ingredients)
            if ingredients_available:
                feasible_recipes.append(recipe)
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
    def _check_recipe_ingredient_against_fridge(recipe_ingredient, fridge_ingredients):
        name = recipe_ingredient.ingredient.nom
        unit_type = recipe_ingredient.unite.type.nom
        converted_quantity = recipe_ingredient.quantite * recipe_ingredient.unite.rapport
        ingredient_available = True
        ingredient_unsure = False
        ingredient_date = None
        if name in fridge_ingredients:
            enough_quantity_of_same_unit_type = (unit_type in fridge_ingredients[name] and
                                                 fridge_ingredients[name][unit_type]["quantity"] >= converted_quantity)
            other_unit_type = set(
                fridge_ingredients[name].keys()).difference({unit_type})
            if enough_quantity_of_same_unit_type:
                ingredient_date = fridge_ingredients[name][unit_type]["date"]
            elif other_unit_type:
                ingredient_unsure = True
                ingredient_date = min(
                    quantity_date["date"] for quantity_date in fridge_ingredients[name].values())
            else:
                ingredient_available = False
        else:
            ingredient_available = False
        return ingredient_available, ingredient_unsure, ingredient_date

    @staticmethod
    def _build_priority_ingredients_field(recipe_id, ingredient_name, ingredient_date, priority_ingredient_date, priority_ingredients):
        if not priority_ingredient_date or ingredient_date < priority_ingredient_date:
            priority_ingredient_date = ingredient_date
            priority_ingredients[recipe_id] = [ingredient_name]
        return priority_ingredients, priority_ingredient_date

    @staticmethod
    def _build_unsure_ingredients_field(recipe_id, ingredient_name, ingredient_unsure, unsure_ingredients):
        if ingredient_unsure:
            if recipe_id not in unsure_ingredients:
                unsure_ingredients[recipe_id] = [ingredient_name]
            else:
                unsure_ingredients[recipe_id] += [ingredient_name]
        elif recipe_id not in unsure_ingredients:
            unsure_ingredients[recipe_id] = []
        return unsure_ingredients
