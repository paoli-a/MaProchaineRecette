from decimal import Decimal
import datetime

import pytest
from pytest_django.asserts import (
    assertContains,
    assertNotContains
)
from rest_framework.test import APIRequestFactory

from frigo.api import IngredientFrigoViewSet
from frigo.models import IngredientFrigo
from frigo.tests.factories import (
    IngredientFrigoFactory,
    ingredientFrigo,
)
from catalogues.tests.factories import IngredientFactory
from unites.tests.factories import UniteFactory


pytestmark = pytest.mark.django_db


def test_ingredientFrigo_list_contains_2_ingredients():
    ingredient1 = IngredientFrigoFactory()
    ingredient2 = IngredientFrigoFactory()
    url = _get_ingredientsFrigo_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = IngredientFrigoViewSet.as_view({'get': 'list'})(request)
    assert response.status_code == 200
    assertContains(response, ingredient1.ingredient)
    assertContains(response, ingredient2.ingredient)


def _get_ingredientsFrigo_list_absolute_url():
    view = IngredientFrigoViewSet()
    view.basename = "ingredients_frigo"
    view.request = None
    return view.reverse_action("list")


def test_ingredientsFrigo_list_has_correct_fields(ingredientFrigo):
    url = _get_ingredientsFrigo_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = IngredientFrigoViewSet.as_view({'get': 'list'})(request)
    assert len(response.data) == 1
    ingredientFrigo_data = response.data[0]
    assert ingredientFrigo_data["id"] == ingredientFrigo.id
    assert ingredientFrigo_data["ingredient"] == ingredientFrigo.ingredient.nom
    assert ingredientFrigo_data["date_peremption"] == str(
        ingredientFrigo.date_peremption)
    assert ingredientFrigo_data["quantite"] == str(ingredientFrigo.quantite)
    assert ingredientFrigo_data["unite"] == ingredientFrigo.unite.abbreviation


def test_adding_ingredientFrigo():
    IngredientFactory(nom="premier ingrédient")
    UniteFactory(abbreviation="g")
    request_data = {'ingredient': "premier ingrédient",
                    'quantite': "10.00",
                    'unite': "g",
                    'date_peremption': "2020-07-20"
                    }
    url = _get_ingredientsFrigo_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data, format='json')
    assert IngredientFrigo.objects.count() == 0
    response_post = IngredientFrigoViewSet.as_view(
        {'post': 'create'})(request_post)
    assert response_post.status_code == 201
    assert IngredientFrigo.objects.count() == 1


def test_adding_ingredientFrigo_deserializes_correctly_all_fields():
    IngredientFactory(nom="deuxieme ingrédient")
    UniteFactory(abbreviation="g")
    request_data = {'ingredient': "deuxieme ingrédient",
                    'quantite': Decimal('10.00'),
                    'date_peremption': datetime.date(2020, 7, 20),
                    'unite': "g"
                    }
    url = _get_ingredientsFrigo_list_absolute_url
    request_post = APIRequestFactory().post(url, request_data)
    response_post = IngredientFrigoViewSet.as_view(
        {'post': 'create'})(request_post)
    assert response_post.status_code == 201
    assert IngredientFrigo.objects.first().quantite == Decimal('10.00')
    assert IngredientFrigo.objects.first().date_peremption == datetime.date(2020, 7, 20)
    assert IngredientFrigo.objects.first().ingredient.nom == "deuxieme ingrédient"
    assert IngredientFrigo.objects.first().unite.abbreviation == "g"


def test_delete_ingredientFrigo(ingredientFrigo):
    detail_url = _get_ingredientsFrigo_detail_absolute_url(
        ingredientFrigo.ingredient)
    request_delete = APIRequestFactory().delete(
        detail_url)
    assert IngredientFrigo.objects.count() == 1
    response_delete = IngredientFrigoViewSet.as_view(
        {'delete': 'destroy'})(request_delete, pk=ingredientFrigo.id)
    assert response_delete.status_code == 204
    assert IngredientFrigo.objects.count() == 0


def _get_ingredientsFrigo_detail_absolute_url(id):
    view = IngredientFrigoViewSet()
    view.basename = "ingredients_frigo"
    view.request = None
    return view.reverse_action("detail", args=[id])
