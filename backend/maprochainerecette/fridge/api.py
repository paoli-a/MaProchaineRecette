import datetime
from typing import Dict, Any

from rest_framework import viewsets, permissions, authentication
from rest_framework.views import APIView
from rest_framework.response import Response

from fridge.models import FridgeIngredient
from catalogs.models import Recipe
from fridge.serializers import FridgeIngredientSerializer, RecipeFridgeSerializer


class FridgeIngredientViewSet(viewsets.ModelViewSet):
    """Provides a CRUD API for fridge ingredients."""
    queryset = FridgeIngredient.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    serializer_class = FridgeIngredientSerializer


class FridgeRecipes(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """View to list feasible recipes according to fridge ingredients.

        Recipes are sorted according to the expiration date of the most 
        priority ingredient of each recipe.

        If an ingredient needed by a recipe is present in the fridge but
        with a unit that is not convertible in the unit of the recipe's 
        ingredient, the recipe is returned with a field called unsure_ingredient
        that contains the name of these ingredients.

        An additional field called priority_ingredients contains the name 
        of the most priority ingredient (ie: the ingredient that will expire 
        the sooner.) of the recipe.

        """
        fridge_ingredients = self._build_fridge_ingredients_data()
        recipes = Recipe.objects.all()
        feasible_recipes = []
        unsure_ingredients: Dict[int, list] = {}
        priority_ingredients: Dict[int, Dict[str, Any]] = {}
        for recipe in recipes:
            ingredients_available = True
            for recipe_ingredient in recipe.ingredients.all():
                name = recipe_ingredient.ingredient.name
                (ingredient_available,
                 ingredient_unsure,
                 ingredient_date) = self._check_recipe_ingredient_against_fridge(
                    recipe_ingredient, fridge_ingredients)
                if not ingredient_available:
                    ingredients_available = False
                else:
                    priority_ingredients = self._build_priority_ingredients_field(
                        recipe.id, name, ingredient_date, priority_ingredients)
                    unsure_ingredients = self._build_unsure_ingredients_field(
                        recipe.id, name, ingredient_unsure, unsure_ingredients)
            if ingredients_available:
                feasible_recipes.append(recipe)
        feasible_recipes = self._sort_recipes(
            feasible_recipes, priority_ingredients)
        serializer = RecipeFridgeSerializer(feasible_recipes, many=True, context={
                                            "unsure_ingredients": unsure_ingredients,
                                            "priority_ingredients": priority_ingredients})
        return Response(serializer.data)

    @staticmethod
    def _build_fridge_ingredients_data():
        # Amounts are converted into the unit that has the ratio equal to 1
        # For each ingredient and unit type, we keep only the erliest date
        data: Dict[str, Dict[str, Dict[str, Any]]] = {}
        # {name : {unit_type: {amount or date: ingredient amount or date}}}
        for fridge_ingredient in FridgeIngredient.objects.all():
            name = fridge_ingredient.ingredient.name
            unit_type = fridge_ingredient.unit.type.name
            date = fridge_ingredient.expiration_date
            converted_amount = fridge_ingredient.amount * fridge_ingredient.unit.rapport
            if name not in data:
                data[name] = {unit_type: {
                    "amount": converted_amount, "date": date}}
            else:
                if unit_type not in data[name]:
                    data[name][unit_type] = {
                        "amount": converted_amount, "date": date}
                else:
                    data[name][unit_type]["amount"] += converted_amount
                    data[name][unit_type]["date"] = min(
                        data[name][unit_type]["date"], date)
        return data

    @staticmethod
    def _check_recipe_ingredient_against_fridge(recipe_ingredient, fridge_ingredients):
        name = recipe_ingredient.ingredient.name
        unit_type = recipe_ingredient.unit.type.name
        converted_amount = recipe_ingredient.amount * recipe_ingredient.unit.rapport
        ingredient_available = True
        ingredient_unsure = False
        ingredient_date = None
        if name in fridge_ingredients:
            enough_amount_of_same_unit_type = (unit_type in fridge_ingredients[name] and
                                                 fridge_ingredients[name][unit_type]["amount"] >= converted_amount)
            other_unit_type = set(
                fridge_ingredients[name].keys()).difference({unit_type})
            if enough_amount_of_same_unit_type:
                ingredient_date = fridge_ingredients[name][unit_type]["date"]
            elif other_unit_type:
                ingredient_unsure = True
                ingredient_date = min(
                    amount_date["date"] for amount_date in fridge_ingredients[name].values())
            else:
                ingredient_available = False
        else:
            ingredient_available = False
        return ingredient_available, ingredient_unsure, ingredient_date

    @staticmethod
    def _build_priority_ingredients_field(recipe_id, ingredient_name, ingredient_date,
                                          priority_ingredients):
        if not recipe_id in priority_ingredients:
            priority_ingredients[recipe_id] = {
                "date": ingredient_date, "name": ingredient_name}
        if ingredient_date < priority_ingredients[recipe_id]["date"]:
            priority_ingredients[recipe_id]["date"] = ingredient_date
            priority_ingredients[recipe_id]["name"] = ingredient_name
        return priority_ingredients

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

    @staticmethod
    def _sort_recipes(feasible_recipes, priority_ingredients):
        return sorted(feasible_recipes, key=lambda recipe: priority_ingredients[recipe.id]["date"])
