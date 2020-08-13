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
from unites.tests.factories import UniteFactory, TypeUniteFactory


pytestmark = pytest.mark.django_db


def test_get_fridge_recipes_returns_feasible_recipes():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unite=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=60, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unite=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=12, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_does_not_return_recipes_for_which_an_ingredient_is_missing():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    poivrons = IngredientFactory(nom="Poivrons")
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=oignons, quantite=60, unite=gramme),
                             IngredientRecetteFactory(ingredient=poivrons, quantite=200, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unite=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=12, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertNotContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_does_not_return_recipes_for_which_an_ingredient_has_not_enough_quantity():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=600, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unite=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=60, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unite=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=12, unite=gramme)]
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
    navet = IngredientFactory(nom="Navet")
    IngredientFrigoFactory(ingredient=navet, quantite=60,
                           unite=gramme, date_peremption=datetime.date(2030, 1, 1))
    IngredientFrigoFactory(ingredient=navet, quantite=40,
                           unite=gramme, date_peremption=datetime.date(2030, 2, 2))
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unite=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=100, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unite=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=80, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_returns_recipes_for_which_an_ingredient_has_different_units():
    carottes, tomates, _, gramme, masse = _dataset_for_fridge_recipes_tests()
    kg = UniteFactory(abbreviation="kg", rapport=1000, type=masse)
    navet = IngredientFactory(nom="Navet")
    IngredientFrigoFactory(ingredient=navet, quantite=2,
                           unite=kg, date_peremption=datetime.date(2030, 1, 1))
    IngredientFrigoFactory(ingredient=navet, quantite=400,
                           unite=gramme, date_peremption=datetime.date(2030, 2, 2))
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unite=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=2400, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unite=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=2.4, unite=kg)]
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
    pieces_type = TypeUniteFactory(nom="pièce(s)")
    pieces = UniteFactory(abbreviation="pièce(s)", rapport=1, type=pieces_type)
    navet = IngredientFactory(nom="Navet")
    IngredientFrigoFactory(ingredient=navet, quantite=1, unite=pieces)
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unite=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=400, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes1, titre="Recette 1")
    IngredientFrigoFactory(ingredient=navet, quantite=200, unite=gramme)
    ingredients_recettes2 = [IngredientRecetteFactory(ingredient=carottes, quantite=350, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=40, unite=gramme),
                             IngredientRecetteFactory(ingredient=navet, quantite=400, unite=gramme)]
    RecetteFactory(ingredients=ingredients_recettes2, titre="Recette 2")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assertContains(response, "Recette 1")
    assertContains(response, "Recette 2")


def test_get_fridge_recipes_returns_correct_fields():
    carottes, tomates, oignons, gramme, _ = _dataset_for_fridge_recipes_tests()
    ingredients_recettes1 = [IngredientRecetteFactory(ingredient=carottes, quantite=500, unite=gramme),
                             IngredientRecetteFactory(
                                 ingredient=tomates, quantite=50, unite=gramme),
                             IngredientRecetteFactory(ingredient=oignons, quantite=60, unite=gramme)]
    recette = RecetteFactory(
        ingredients=ingredients_recettes1, titre="Recette 1")
    url = reverse("recettes_frigo_list")
    request = APIRequestFactory().get(url)
    response = RecettesFrigo.as_view()(request)
    assert len(response.data) == 1
    recette_data = response.data[0]
    assert recette_data["id"] == recette.id
    assertContains(response, recette.titre)
    assertContains(response, recette.description)
    assertContains(response, recette.duree)
    assert len(recette_data["ingredients"]) == 3
    assert set(recette_data["ingredients"][0].keys(
    )) == {"ingredient", "quantite", "unite"}
    assert recette_data["ingredients"][0]["ingredient"] == "Carottes"
    assert recette_data["ingredients"][0]["unite"] == "g"
    assert len(recette_data["categories"]) == 0
    assert len(recette_data["unsure_ingredients"]) == 0
    assert len(recette_data["priority_ingredients"]) == 1
    assert recette_data["priority_ingredients"][0] == "Carottes"


def _dataset_for_fridge_recipes_tests():
    masse = TypeUniteFactory(nom="masse")
    gramme = UniteFactory(abbreviation="g", rapport=1, type=masse)
    carottes = IngredientFactory(nom="Carottes")
    tomates = IngredientFactory(nom="Tomates")
    oignons = IngredientFactory(nom="Oignons")
    IngredientFrigoFactory(ingredient=carottes, quantite=500,
                           unite=gramme, date_peremption=datetime.date(2130, 1, 1))
    IngredientFrigoFactory(ingredient=tomates, quantite=50,
                           unite=gramme, date_peremption=datetime.date(2130, 2, 2))
    IngredientFrigoFactory(ingredient=oignons, quantite=60,
                           unite=gramme, date_peremption=datetime.date(2131, 1, 1))
    return carottes, tomates, oignons, gramme, masse
