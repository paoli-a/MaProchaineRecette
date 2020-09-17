import datetime

import pytest
from pytest_django.asserts import (
    assertContains,
    assertNotContains
)
from rest_framework.test import APIRequestFactory
from django.urls import reverse

from frigo.api import RecettesFrigo
from frigo.tests.factories import (
    IngredientFrigoFactory,
)
from catalogues.tests.factories import IngredientFactory, RecetteFactory, IngredientRecetteFactory
from units.tests.factories import UnitFactory, UnitTypeFactory


pytestmark = pytest.mark.django_db


def test_get_fridge_recipes_returns_feasible_recipes():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unit=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=60, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unit=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=12, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_does_not_return_recipes_for_which_an_ingredient_is_missing():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    poivrons = IngredientFactory(name="Poivrons")
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=oignons, quantite=60, unit=gramme),
                             IngredientRecetteFactory(ingredient=poivrons, quantite=200, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unit=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=12, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertNotContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_does_not_return_recipes_for_which_an_ingredient_has_not_enough_quantity():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=600, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unit=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=60, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unit=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=12, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertNotContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_returns_recipes_for_which_ingredients_are_splitted():
    """When a recipe has one of its ingredients in the fridge with different
    expiration dates, the recipe should still be returned if the summed
    quantities are enough.
    """
    carottes, tomates, _, gramme, _ = _dataset_for_fridge_recipes_tests()
    navet = IngredientFactory(name="Navet")
    IngredientFrigoFactory(ingredient=navet, quantite=60,
                           unit=gramme, expiration_date=datetime.date(2030, 1, 1))
    IngredientFrigoFactory(ingredient=navet, quantite=40,
                           unit=gramme, expiration_date=datetime.date(2030, 2, 2))
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unit=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=100, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unit=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=80, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_returns_recipes_for_which_an_ingredient_has_different_units():
    carottes, tomates, _, gramme, masse = _dataset_for_fridge_recipes_tests()
    kg = UnitFactory(abbreviation="kg", rapport=1000, type=masse)
    navet = IngredientFactory(name="Navet")
    IngredientFrigoFactory(ingredient=navet, quantite=2,
                           unit=kg, expiration_date=datetime.date(2030, 1, 1))
    IngredientFrigoFactory(ingredient=navet, quantite=400,
                           unit=gramme, expiration_date=datetime.date(2030, 2, 2))
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unit=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=2400, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unit=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=2.4, unit=kg)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_returns_recipes_that_have_unsure_ingredients():
    """Unsure ingredients are ingredients that have a unit type different from
    the recipe's ingredient unit type. The conversion between two different unit
    types has not been implemented yet, so the feasibility of the recipe is not sure.
    """
    carottes, tomates, _, gramme, _ = _dataset_for_fridge_recipes_tests()
    pieces_type = UnitTypeFactory(name="pièce(s)")
    pieces = UnitFactory(abbreviation="pièce(s)", rapport=1, type=pieces_type)
    navet = IngredientFactory(name="Navet")
    IngredientFrigoFactory(ingredient=navet, quantite=1, unit=pieces)
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unit=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=400, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    IngredientFrigoFactory(ingredient=navet, quantite=200, unit=gramme)
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unit=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=400, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_returns_correctly_ordered_recipes():
    """Recipes must be ordered according to the expiration date of the most prioritary ingredient.
    """
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    navet = IngredientFactory(name="Navet")
    IngredientFrigoFactory(ingredient=navet, quantite=100,
                           unit=gramme, expiration_date=datetime.date(2132, 1, 1))
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=oignons, quantite=50, unit=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=50, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unit=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=40, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    ingredients_recettes3 = [IngredientRecetteFactory(ingredient=oignons, quantite=50, unit=gramme),
                             IngredientRecetteFactory(ingredient=tomates, quantite=40, unit=gramme)]
    RecetteFactory(ingredients=ingredients_recettes3, titre="Recette 3")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    # carottes > tomates > oignons > navet
    assert response.data[0]["titre"] == "Recette 2"
    assert response.data[1]["titre"] == "Recette 3"
    assert response.data[2]["titre"] == "Recette 1"


def test_get_fridge_recipes_returns_correct_fields():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unit=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unit=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=60, unit=gramme)]
    recette = RecetteFactory(
        ingredients=ingredients_recettes1, titre="Recette 1")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    _check_recipe_fields(response, recette)
    assert len(response.data[0]["unsure_ingredients"]) == 0


def test_get_fridge_recipes_returns_correct_fields_with_unsure_ingredients():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    pieces_type = UnitTypeFactory(name="pièce(s)")
    pieces = UnitFactory(abbreviation="pièce(s)", rapport=1, type=pieces_type)
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=3, unit=pieces),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unit=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=2, unit=pieces)]
    recette = RecetteFactory(
        ingredients=ingredients_recettes1, titre="Recette 1")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    _check_recipe_fields(response, recette)
    assert response.data[0]["unsure_ingredients"] == ["Carottes", "Oignons"]


def _check_recipe_fields(response, recette):
    assert len(response.data) == 1
    recette_data = response.data[0]
    assert recette_data["id"] == recette.id
    assertContains(response, recette.titre)
    assertContains(response, recette.description)
    assertContains(response, recette.duree)
    assert len(recette_data["ingredients"]) == 3
    assert set(recette_data["ingredients"][0].keys(
    )) == {"ingredient", "quantite", "unit"}
    assert recette_data["ingredients"][1]["ingredient"] == "Tomates"
    assert recette_data["ingredients"][1]["unit"] == "g"
    assert recette_data["ingredients"][1]["quantite"] == "50.00"
    assert len(recette_data["categories"]) == 0
    assert len(recette_data["priority_ingredients"]) == 1
    assert recette_data["priority_ingredients"][0] == "Carottes"


def _dataset_for_fridge_recipes_tests():
    masse = UnitTypeFactory(name="masse")
    gramme = UnitFactory(abbreviation="g", rapport=1, type=masse)
    carottes = IngredientFactory(name="Carottes")
    tomates = IngredientFactory(name="Tomates")
    oignons = IngredientFactory(name="Oignons")
    IngredientFrigoFactory(ingredient=carottes, quantite=500,
                           unit=gramme, expiration_date=datetime.date(2130, 1, 1))
    IngredientFrigoFactory(ingredient=tomates, quantite=50,
                           unit=gramme, expiration_date=datetime.date(2130, 2, 2))
    IngredientFrigoFactory(ingredient=oignons, quantite=60,
                           unit=gramme, expiration_date=datetime.date(2131, 1, 1))
    return carottes, tomates, oignons, gramme, masse
