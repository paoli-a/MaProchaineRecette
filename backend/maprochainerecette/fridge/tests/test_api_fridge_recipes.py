import datetime
import uuid

import pytest
from catalogs.tests.factories import (
    IngredientFactory,
    RecipeFactory,
    RecipeIngredientFactory,
)
from django.urls import reverse
from fridge.api import FridgeRecipes
from fridge.tests.factories import FridgeIngredientFactory
from pytest_django.asserts import assertContains, assertNotContains
from rest_framework.test import APIRequestFactory
from units.tests.factories import UnitFactory, UnitTypeFactory

pytestmark = pytest.mark.django_db


def test_get_fridge_recipes_returns_feasible_recipes():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredients_recipes1 = [
        RecipeIngredientFactory(ingredient=carottes, amount=500, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=oignons, amount=60, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes1, title="Recipe 1")
    ingredients_recipes2 = [
        RecipeIngredientFactory(ingredient=carottes, amount=350, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=40, unit=gramme),
        RecipeIngredientFactory(ingredient=oignons, amount=12, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes2, title="Recipe 2")
    url = reverse("recipes_fridge_list")
    request = APIRequestFactory().get(url)
    response = FridgeRecipes.as_view()(request)
    assertContains(response, "Recipe 1")
    assertContains(response, "Recipe 2")


def test_get_fridge_recipes_does_not_return_recipes_for_which_an_ingredient_is_missing():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    poivrons = IngredientFactory(name="Poivrons")
    ingredients_recipes1 = [
        RecipeIngredientFactory(ingredient=carottes, amount=500, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=oignons, amount=60, unit=gramme),
        RecipeIngredientFactory(ingredient=poivrons, amount=200, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes1, title="Recipe 1")
    ingredients_recipes2 = [
        RecipeIngredientFactory(ingredient=carottes, amount=350, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=40, unit=gramme),
        RecipeIngredientFactory(ingredient=oignons, amount=12, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes2, title="Recipe 2")
    url = reverse("recipes_fridge_list")
    request = APIRequestFactory().get(url)
    response = FridgeRecipes.as_view()(request)
    assertNotContains(response, "Recipe 1")
    assertContains(response, "Recipe 2")


def test_get_fridge_recipes_does_not_return_recipes_for_which_an_ingredient_has_not_enough_amount():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredients_recipes1 = [
        RecipeIngredientFactory(ingredient=carottes, amount=600, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=oignons, amount=60, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes1, title="Recipe 1")
    ingredients_recipes2 = [
        RecipeIngredientFactory(ingredient=carottes, amount=350, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=40, unit=gramme),
        RecipeIngredientFactory(ingredient=oignons, amount=12, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes2, title="Recipe 2")
    url = reverse("recipes_fridge_list")
    request = APIRequestFactory().get(url)
    response = FridgeRecipes.as_view()(request)
    assertNotContains(response, "Recipe 1")
    assertContains(response, "Recipe 2")


def test_get_fridge_recipes_returns_recipes_for_which_ingredients_are_splitted():
    """When a recipe has one of its ingredients in the fridge with different
    expiration dates, the recipe should still be returned if the summed
    quantities are enough.
    """  # noqa: D400, D205
    carottes, tomates, _, gramme, _ = _dataset_for_fridge_recipes_tests()
    navet = IngredientFactory(name="Navet")
    FridgeIngredientFactory(
        ingredient=navet,
        amount=60,
        unit=gramme,
        expiration_date=datetime.date(2030, 1, 1),
    )
    FridgeIngredientFactory(
        ingredient=navet,
        amount=40,
        unit=gramme,
        expiration_date=datetime.date(2030, 2, 2),
    )
    ingredients_recipes1 = [
        RecipeIngredientFactory(ingredient=carottes, amount=500, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=navet, amount=100, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes1, title="Recipe 1")
    ingredients_recipes2 = [
        RecipeIngredientFactory(ingredient=carottes, amount=350, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=40, unit=gramme),
        RecipeIngredientFactory(ingredient=navet, amount=80, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes2, title="Recipe 2")
    url = reverse("recipes_fridge_list")
    request = APIRequestFactory().get(url)
    response = FridgeRecipes.as_view()(request)
    assertContains(response, "Recipe 1")
    assertContains(response, "Recipe 2")


def test_get_fridge_recipes_returns_recipes_for_which_an_ingredient_has_different_units():
    carottes, tomates, _, gramme, masse = _dataset_for_fridge_recipes_tests()
    kg = UnitFactory(abbreviation="kg", rapport=1000, type=masse)
    navet = IngredientFactory(name="Navet")
    FridgeIngredientFactory(
        ingredient=navet, amount=2, unit=kg, expiration_date=datetime.date(2030, 1, 1)
    )
    FridgeIngredientFactory(
        ingredient=navet,
        amount=400,
        unit=gramme,
        expiration_date=datetime.date(2030, 2, 2),
    )
    ingredients_recipes1 = [
        RecipeIngredientFactory(ingredient=carottes, amount=500, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=navet, amount=2400, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes1, title="Recipe 1")
    ingredients_recipes2 = [
        RecipeIngredientFactory(ingredient=carottes, amount=350, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=40, unit=gramme),
        RecipeIngredientFactory(ingredient=navet, amount=2.4, unit=kg),
    ]
    RecipeFactory(ingredients=ingredients_recipes2, title="Recipe 2")
    url = reverse("recipes_fridge_list")
    request = APIRequestFactory().get(url)
    response = FridgeRecipes.as_view()(request)
    assertContains(response, "Recipe 1")
    assertContains(response, "Recipe 2")


def test_get_fridge_recipes_returns_recipes_that_have_unsure_ingredients():
    """Unsure ingredients are ingredients that have a unit type different from
    the recipe's ingredient unit type. The conversion between two different unit
    types has not been implemented yet, so the feasibility of the recipe is not sure.
    """  # noqa: D400, D205
    carottes, tomates, _, gramme, _ = _dataset_for_fridge_recipes_tests()
    pieces_type = UnitTypeFactory(name="pièce(s)")
    pieces = UnitFactory(abbreviation="pièce(s)", rapport=1, type=pieces_type)
    navet = IngredientFactory(name="Navet")
    FridgeIngredientFactory(ingredient=navet, amount=1, unit=pieces)
    ingredients_recipes1 = [
        RecipeIngredientFactory(ingredient=carottes, amount=500, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=navet, amount=400, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes1, title="Recipe 1")
    FridgeIngredientFactory(ingredient=navet, amount=200, unit=gramme)
    ingredients_recipes2 = [
        RecipeIngredientFactory(ingredient=carottes, amount=350, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=40, unit=gramme),
        RecipeIngredientFactory(ingredient=navet, amount=400, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes2, title="Recipe 2")
    url = reverse("recipes_fridge_list")
    request = APIRequestFactory().get(url)
    response = FridgeRecipes.as_view()(request)
    assertContains(response, "Recipe 1")
    assertContains(response, "Recipe 2")


def test_get_fridge_recipes_returns_correctly_ordered_recipes():
    """Recipes must be ordered according to the expiration date of the most prioritary ingredient."""
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    navet = IngredientFactory(name="Navet")
    FridgeIngredientFactory(
        ingredient=navet,
        amount=100,
        unit=gramme,
        expiration_date=datetime.date(2132, 1, 1),
    )
    ingredients_recipes1 = [
        RecipeIngredientFactory(ingredient=oignons, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=navet, amount=50, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes1, title="Recipe 1")
    ingredients_recipes2 = [
        RecipeIngredientFactory(ingredient=carottes, amount=350, unit=gramme),
        RecipeIngredientFactory(ingredient=navet, amount=40, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes2, title="Recipe 2")
    ingredients_recipes3 = [
        RecipeIngredientFactory(ingredient=oignons, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=40, unit=gramme),
    ]
    RecipeFactory(ingredients=ingredients_recipes3, title="Recipe 3")
    url = reverse("recipes_fridge_list")
    request = APIRequestFactory().get(url)
    response = FridgeRecipes.as_view()(request)
    # carottes > tomates > oignons > navet
    assert response.data[0]["title"] == "Recipe 2"
    assert response.data[1]["title"] == "Recipe 3"
    assert response.data[2]["title"] == "Recipe 1"


def test_get_fridge_recipes_returns_correct_fields():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredients_recipes1 = [
        RecipeIngredientFactory(ingredient=carottes, amount=500, unit=gramme),
        RecipeIngredientFactory(ingredient=tomates, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=oignons, amount=60, unit=gramme),
    ]
    recipe = RecipeFactory(ingredients=ingredients_recipes1, title="Recipe 1")
    url = reverse("recipes_fridge_list")
    request = APIRequestFactory().get(url)
    response = FridgeRecipes.as_view()(request)
    _check_recipe_fields(response, recipe)
    assert len(response.data[0]["unsure_ingredients"]) == 0


def test_get_fridge_recipes_returns_correct_fields_with_unsure_ingredients():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    pieces_type = UnitTypeFactory(name="pièce(s)")
    pieces = UnitFactory(abbreviation="pièce(s)", rapport=1, type=pieces_type)
    ingredients_recipes1 = [
        RecipeIngredientFactory(ingredient=carottes, amount=3, unit=pieces),
        RecipeIngredientFactory(ingredient=tomates, amount=50, unit=gramme),
        RecipeIngredientFactory(ingredient=oignons, amount=2, unit=pieces),
    ]
    recipe = RecipeFactory(ingredients=ingredients_recipes1, title="Recipe 1")
    url = reverse("recipes_fridge_list")
    request = APIRequestFactory().get(url)
    response = FridgeRecipes.as_view()(request)
    _check_recipe_fields(response, recipe)
    assert set(response.data[0]["unsure_ingredients"]) == {"Carottes", "Oignons"}


def _check_recipe_fields(response, recipe):
    assert len(response.data) == 1
    recipe_data = response.data[0]
    assert uuid.UUID(recipe_data["id"]) == recipe.id
    assertContains(response, recipe.title)
    assertContains(response, recipe.description)
    assertContains(response, recipe.duration)
    assert len(recipe_data["ingredients"]) == 3
    assert set(recipe_data["ingredients"][0].keys()) == {"ingredient", "amount", "unit"}
    tomate = [
        ingredient
        for ingredient in recipe_data["ingredients"]
        if ingredient["ingredient"] == "Tomates"
    ]
    assert tomate[0]["unit"] == "g"
    assert tomate[0]["amount"] == "50.00"
    assert len(recipe_data["categories"]) == 0
    assert len(recipe_data["priority_ingredients"]) == 1
    assert recipe_data["priority_ingredients"][0] == "Carottes"


def _dataset_for_fridge_recipes_tests():
    masse = UnitTypeFactory(name="masse")
    gramme = UnitFactory(abbreviation="g", rapport=1, type=masse)
    carottes = IngredientFactory(name="Carottes")
    tomates = IngredientFactory(name="Tomates")
    oignons = IngredientFactory(name="Oignons")
    FridgeIngredientFactory(
        ingredient=carottes,
        amount=500,
        unit=gramme,
        expiration_date=datetime.date(2130, 1, 1),
    )
    FridgeIngredientFactory(
        ingredient=tomates,
        amount=50,
        unit=gramme,
        expiration_date=datetime.date(2130, 2, 2),
    )
    FridgeIngredientFactory(
        ingredient=oignons,
        amount=60,
        unit=gramme,
        expiration_date=datetime.date(2131, 1, 1),
    )
    return carottes, tomates, oignons, gramme, masse
