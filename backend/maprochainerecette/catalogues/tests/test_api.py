import pytest
from pytest_django.asserts import (
    assertContains,
    assertNotContains
)
from rest_framework.test import APIRequestFactory

from ..api import IngredientViewSet
from .factories import IngredientFactory, ingredient

pytestmark = pytest.mark.django_db


def test_ingredient_list_contains_2_ingredients():
    ingredient1 = IngredientFactory()
    ingredient2 = IngredientFactory()
    url = _get_ingredients_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = IngredientViewSet.as_view({'get': 'list'})(request)
    assert response.status_code == 200
    assertContains(response, ingredient1.nom)
    assertContains(response, ingredient2.nom)


def _get_ingredients_list_absolute_url():
    view = IngredientViewSet()
    view.basename = "ingredients"
    view.request = None
    return view.reverse_action("list")


def test_adding_ingredient(ingredient):
    url = _get_ingredients_list_absolute_url()
    request = APIRequestFactory().post(url, {'nom': ingredient.nom})
    response = IngredientViewSet.as_view({'post': 'list'})(request)
    assert response.status_code == 200
    assertContains(response, ingredient.nom)


def test_delete_ingredient(ingredient):
    detail_url = _get_ingredients_detail_absolute_url(ingredient.nom)
    request_delete = APIRequestFactory().delete(
        detail_url)
    response_delete = IngredientViewSet.as_view(
        {'delete': 'destroy'})(request_delete, nom=ingredient.nom)
    assert response_delete.status_code == 204
    list_url = _get_ingredients_list_absolute_url()
    request_get = APIRequestFactory().get(list_url)
    response_get = IngredientViewSet.as_view({'get': 'list'})(request_get)
    assert response_get.status_code == 200
    assertNotContains(response_get, ingredient.nom)


def _get_ingredients_detail_absolute_url(nom):
    view = IngredientViewSet()
    view.basename = "ingredients"
    view.request = None
    return view.reverse_action("detail", args=[nom])
