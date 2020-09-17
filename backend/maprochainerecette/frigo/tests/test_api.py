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
from units.tests.factories import UnitFactory, UnitTypeFactory


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
    assert ingredientFrigo_data["ingredient"] == ingredientFrigo.ingredient.name
    assert ingredientFrigo_data["expiration_date"] == str(
        ingredientFrigo.expiration_date)
    assert ingredientFrigo_data["amount"] == str(ingredientFrigo.amount)
    assert ingredientFrigo_data["unit"] == ingredientFrigo.unit.abbreviation


def test_adding_ingredientFrigo():
    IngredientFactory(name="premier ingrédient")
    UnitFactory(abbreviation="g")
    request_data = {'ingredient': "premier ingrédient",
                    'amount': "10.00",
                    'unit': "g",
                    'expiration_date': "2020-07-20"
                    }
    url = _get_ingredientsFrigo_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data, format='json')
    assert IngredientFrigo.objects.count() == 0
    response_post = IngredientFrigoViewSet.as_view(
        {'post': 'create'})(request_post)
    assert response_post.status_code == 201
    assert IngredientFrigo.objects.count() == 1


def test_adding_ingredientFrigo_deserializes_correctly_all_fields():
    IngredientFactory(name="deuxieme ingrédient")
    UnitFactory(abbreviation="g")
    request_data = {'ingredient': "deuxieme ingrédient",
                    'amount': Decimal('10.00'),
                    'expiration_date': datetime.date(2020, 7, 20),
                    'unit': "g"
                    }
    url = _get_ingredientsFrigo_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data)
    response_post = IngredientFrigoViewSet.as_view(
        {'post': 'create'})(request_post)
    assert response_post.status_code == 201
    ingredient = IngredientFrigo.objects.first()
    assert isinstance(ingredient.id, int)
    assert ingredient.amount == Decimal('10.00')
    assert ingredient.expiration_date == datetime.date(2020, 7, 20)
    assert ingredient.ingredient.name == "deuxieme ingrédient"
    assert ingredient.unit.abbreviation == "g"


def test_adding_mergeable_ingredientFrigo_returns_correct_data():
    IngredientFactory(name="deuxieme ingrédient")
    unit_type = UnitTypeFactory(name="masse")
    UnitFactory(abbreviation="g", rapport=1, type=unit_type)
    UnitFactory(abbreviation="kg", rapport=1000, type=unit_type)
    request_data = {'ingredient': "deuxieme ingrédient",
                    'amount': '10.00',
                    'expiration_date': "2020-07-20",
                    'unit': "g"
                    }
    url = _get_ingredientsFrigo_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data)
    response_post = IngredientFrigoViewSet.as_view(
        {'post': 'create'})(request_post)
    assert response_post.status_code == 201
    expected_response = {'id': 1, 'ingredient': 'deuxieme ingrédient',
                         'expiration_date': '2020-07-20', 'amount': '10.00', 'unit': 'g'}
    assert response_post.data == expected_response
    request_data_mergeable = {'ingredient': "deuxieme ingrédient",
                              'amount': '0.10',
                              'expiration_date': "2020-07-20",
                              'unit': "kg"
                              }
    url = _get_ingredientsFrigo_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data_mergeable)
    response_post = IngredientFrigoViewSet.as_view(
        {'post': 'create'})(request_post)
    assert response_post.status_code == 201
    expected_response = {'id': 1, 'ingredient': 'deuxieme ingrédient',
                         'expiration_date': '2020-07-20', 'amount': '0.11', 'unit': 'kg'}
    assert response_post.data == expected_response


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
