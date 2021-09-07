import datetime

import pytest
from catalogs.tests.factories import (
    IngredientFactory,
    RecipeFactory,
    RecipeIngredientFactory,
)
from django.urls import reverse
from fridge.api import ConsumeIngredients
from fridge.tests.factories import FridgeIngredientFactory
from rest_framework.test import APIRequestFactory
from units.tests.factories import UnitFactory, UnitTypeFactory

from ..models import FridgeIngredient

pytestmark = pytest.mark.django_db


def test_consume_ingredients_removes_correctly_fridge_ingredients():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredient_partially_consumed = FridgeIngredientFactory(
        ingredient=carottes, amount=500, unit=gramme
    )
    ingredient_not_consumed = FridgeIngredientFactory(
        ingredient=tomates, amount=60, unit=gramme
    )
    ingredient_totally_consumed = FridgeIngredientFactory(
        ingredient=oignons, amount=10, unit=gramme
    )
    ingredient_recipe = [
        RecipeIngredientFactory(ingredient=carottes, amount=400, unit=gramme),
        RecipeIngredientFactory(ingredient=oignons, amount=10, unit=gramme),
    ]
    recipe = RecipeFactory(ingredients=ingredient_recipe, title="Recipe 1")
    url = reverse("recipes_consume", args=[recipe.id])
    request = APIRequestFactory().post(url, {"recipe_id": recipe.id})
    response = ConsumeIngredients.as_view()(request, recipe.id)
    assert response.status_code == 200
    ingredient_partially_consumed.refresh_from_db()
    ingredient_not_consumed.refresh_from_db()
    assert ingredient_not_consumed.amount == 60
    assert ingredient_partially_consumed.amount == 100
    assert not FridgeIngredient.objects.filter(
        ingredient=ingredient_totally_consumed.ingredient
    ).exists()


def test_consume_ingredients_removes_correctly_fridge_ingredients_with_different_expiration_dates():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    priority_ingredient_recipe1 = FridgeIngredientFactory(
        ingredient=carottes,
        amount=500,
        unit=gramme,
        expiration_date=datetime.date(2030, 7, 20),
    )
    fridge_ingredient_recipe1 = FridgeIngredientFactory(
        ingredient=carottes,
        amount=60,
        unit=gramme,
        expiration_date=datetime.date(2030, 7, 27),
    )
    priority_ingredient_recipe2 = FridgeIngredientFactory(
        ingredient=oignons,
        amount=30,
        unit=gramme,
        expiration_date=datetime.date(2030, 8, 10),
    )
    fridge_ingredient_recipe2 = FridgeIngredientFactory(
        ingredient=oignons,
        amount=10,
        unit=gramme,
        expiration_date=datetime.date(2030, 9, 10),
    )
    fridge_ingredient_recipe3 = FridgeIngredientFactory(
        ingredient=oignons,
        amount=70,
        unit=gramme,
        expiration_date=datetime.date(2030, 9, 15),
    )
    ingredient_recipe1 = [
        RecipeIngredientFactory(ingredient=carottes, amount=60, unit=gramme),
    ]
    ingredient_recipe2 = [
        RecipeIngredientFactory(ingredient=oignons, amount=100, unit=gramme),
    ]
    recipe1 = RecipeFactory(ingredients=ingredient_recipe1, title="Recipe 1")
    recipe2 = RecipeFactory(ingredients=ingredient_recipe2, title="Recipe 2")
    url = reverse("recipes_consume", args=[recipe1.id])
    request = APIRequestFactory().post(url, {"recipe_id": recipe1.id})
    response = ConsumeIngredients.as_view()(request, recipe1.id)
    assert response.status_code == 200
    priority_ingredient_recipe1.refresh_from_db()
    fridge_ingredient_recipe1.refresh_from_db()
    assert priority_ingredient_recipe1.amount == 440
    assert fridge_ingredient_recipe1.amount == 60
    url = reverse("recipes_consume", args=[recipe2.id])
    request = APIRequestFactory().post(url, {"recipe_id": recipe2.id})
    response = ConsumeIngredients.as_view()(request, recipe2.id)
    assert response.status_code == 200
    fridge_ingredient_recipe3.refresh_from_db()
    assert not FridgeIngredient.objects.filter(
        id=priority_ingredient_recipe2.id
    ).exists()
    assert not FridgeIngredient.objects.filter(id=fridge_ingredient_recipe2.id).exists()
    assert fridge_ingredient_recipe3.amount == 10


def _dataset_for_fridge_recipes_tests():
    masse = UnitTypeFactory(name="masse")
    gramme = UnitFactory(abbreviation="g", rapport=1, type=masse)
    carottes = IngredientFactory(name="Carottes")
    tomates = IngredientFactory(name="Tomates")
    oignons = IngredientFactory(name="Oignons")
    return carottes, tomates, oignons, gramme, masse
