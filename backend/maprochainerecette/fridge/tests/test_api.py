from decimal import Decimal
import datetime

import pytest
from pytest_django.asserts import assertContains, assertNotContains
from rest_framework.test import APIRequestFactory

from fridge.api import FridgeIngredientViewSet
from fridge.models import FridgeIngredient
from fridge.tests.factories import (
    FridgeIngredientFactory,
    fridgeIngredient,
)
from catalogs.tests.factories import IngredientFactory
from units.tests.factories import UnitFactory, UnitTypeFactory


pytestmark = pytest.mark.django_db


def test_fridgeIngredient_list_contains_2_ingredients():
    ingredient1 = FridgeIngredientFactory()
    ingredient2 = FridgeIngredientFactory()
    url = _get_fridgeIngredients_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = FridgeIngredientViewSet.as_view({"get": "list"})(request)
    assert response.status_code == 200
    assertContains(response, ingredient1.ingredient)
    assertContains(response, ingredient2.ingredient)


def _get_fridgeIngredients_list_absolute_url():
    view = FridgeIngredientViewSet()
    view.basename = "ingredients_fridge"
    view.request = None
    return view.reverse_action("list")


def test_fridgeIngredients_list_has_correct_fields(fridgeIngredient):
    url = _get_fridgeIngredients_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = FridgeIngredientViewSet.as_view({"get": "list"})(request)
    assert len(response.data) == 1
    fridgeIngredient_data = response.data[0]
    assert fridgeIngredient_data["id"] == fridgeIngredient.id
    assert fridgeIngredient_data["ingredient"] == fridgeIngredient.ingredient.name
    assert fridgeIngredient_data["expiration_date"] == str(
        fridgeIngredient.expiration_date
    )
    assert fridgeIngredient_data["amount"] == str(fridgeIngredient.amount)
    assert fridgeIngredient_data["unit"] == fridgeIngredient.unit.abbreviation


def test_adding_fridgeIngredient():
    IngredientFactory(name="premier ingrédient")
    UnitFactory(abbreviation="g")
    request_data = {
        "ingredient": "premier ingrédient",
        "amount": "10.00",
        "unit": "g",
        "expiration_date": "2020-07-20",
    }
    url = _get_fridgeIngredients_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data, format="json")
    assert FridgeIngredient.objects.count() == 0
    response_post = FridgeIngredientViewSet.as_view({"post": "create"})(request_post)
    assert response_post.status_code == 201
    assert FridgeIngredient.objects.count() == 1


def test_adding_fridgeIngredient_deserializes_correctly_all_fields():
    IngredientFactory(name="deuxieme ingrédient")
    UnitFactory(abbreviation="g")
    request_data = {
        "ingredient": "deuxieme ingrédient",
        "amount": Decimal("10.00"),
        "expiration_date": datetime.date(2020, 7, 20),
        "unit": "g",
    }
    url = _get_fridgeIngredients_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data)
    response_post = FridgeIngredientViewSet.as_view({"post": "create"})(request_post)
    assert response_post.status_code == 201
    ingredient = FridgeIngredient.objects.first()
    assert isinstance(ingredient.id, int)
    assert ingredient.amount == Decimal("10.00")
    assert ingredient.expiration_date == datetime.date(2020, 7, 20)
    assert ingredient.ingredient.name == "deuxieme ingrédient"
    assert ingredient.unit.abbreviation == "g"


def test_adding_mergeable_fridgeIngredient_returns_correct_data():
    IngredientFactory(name="deuxieme ingrédient")
    unit_type = UnitTypeFactory(name="masse")
    UnitFactory(abbreviation="g", rapport=1, type=unit_type)
    UnitFactory(abbreviation="kg", rapport=1000, type=unit_type)
    request_data = {
        "ingredient": "deuxieme ingrédient",
        "amount": "10.00",
        "expiration_date": "2020-07-20",
        "unit": "g",
    }
    url = _get_fridgeIngredients_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data)
    response_post = FridgeIngredientViewSet.as_view({"post": "create"})(request_post)
    assert response_post.status_code == 201
    expected_response = {
        "id": 1,
        "ingredient": "deuxieme ingrédient",
        "expiration_date": "2020-07-20",
        "amount": "10.00",
        "unit": "g",
    }
    assert response_post.data == expected_response
    request_data_mergeable = {
        "ingredient": "deuxieme ingrédient",
        "amount": "0.10",
        "expiration_date": "2020-07-20",
        "unit": "kg",
    }
    url = _get_fridgeIngredients_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data_mergeable)
    response_post = FridgeIngredientViewSet.as_view({"post": "create"})(request_post)
    assert response_post.status_code == 201
    expected_response = {
        "id": 1,
        "ingredient": "deuxieme ingrédient",
        "expiration_date": "2020-07-20",
        "amount": "0.11",
        "unit": "kg",
    }
    assert response_post.data == expected_response


def test_delete_fridgeIngredient(fridgeIngredient):
    detail_url = _get_fridgeIngredients_detail_absolute_url(fridgeIngredient.ingredient)
    request_delete = APIRequestFactory().delete(detail_url)
    assert FridgeIngredient.objects.count() == 1
    response_delete = FridgeIngredientViewSet.as_view({"delete": "destroy"})(
        request_delete, pk=fridgeIngredient.id
    )
    assert response_delete.status_code == 204
    assert FridgeIngredient.objects.count() == 0


def _get_fridgeIngredients_detail_absolute_url(id):
    view = FridgeIngredientViewSet()
    view.basename = "ingredients_fridge"
    view.request = None
    return view.reverse_action("detail", args=[id])
