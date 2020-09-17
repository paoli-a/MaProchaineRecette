import datetime
from decimal import Decimal

import pytest
from pytest_django.asserts import (
    assertContains,
    assertNotContains
)
from rest_framework.test import APIRequestFactory

from catalogues.api import IngredientViewSet, RecetteViewSet, CategorieViewSet
from catalogues.models import Recette, Ingredient
from .factories import (
    IngredientFactory,
    ingredient,
    RecetteFactory,
    recette,
    IngredientRecetteFactory,
    CategoryFactory
)
from units.tests.factories import UnitFactory, UnitTypeFactory

pytestmark = pytest.mark.django_db


def test_ingredient_list_contains_2_ingredients():
    ingredient1 = IngredientFactory()
    ingredient2 = IngredientFactory()
    url = _get_ingredients_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = IngredientViewSet.as_view({'get': 'list'})(request)
    assert response.status_code == 200
    assertContains(response, ingredient1.name)
    assertContains(response, ingredient2.name)


def _get_ingredients_list_absolute_url():
    return _get_list_absolute_url(IngredientViewSet, "ingredients")


def _get_list_absolute_url(viewset_class, viewset_basename):
    view = viewset_class()
    view.basename = viewset_basename
    view.request = None
    return view.reverse_action("list")


def test_adding_ingredient():
    request_data = {'name': "ingredient name"}
    url = _get_ingredients_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data)
    assert Ingredient.objects.count() == 0
    response_post = IngredientViewSet.as_view({'post': 'create'})(request_post)
    assert response_post.status_code == 201
    assert Ingredient.objects.count() == 1


def test_adding_ingredient_deserializes_correctly_all_fields():
    request_data = {'name': "ingredient name"}
    url = _get_ingredients_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data)
    response_post = IngredientViewSet.as_view({'post': 'create'})(request_post)
    assert response_post.status_code == 201
    assert Ingredient.objects.first().name == "ingredient name"


def test_delete_ingredient(ingredient):
    detail_url = _get_ingredients_detail_absolute_url(ingredient.name)
    request_delete = APIRequestFactory().delete(
        detail_url)
    assert Ingredient.objects.count() == 1
    response_delete = IngredientViewSet.as_view(
        {'delete': 'destroy'})(request_delete, name=ingredient.name)
    assert response_delete.status_code == 204
    assert Ingredient.objects.count() == 0


def _get_ingredients_detail_absolute_url(name):
    view = IngredientViewSet()
    view.basename = "ingredients"
    view.request = None
    return view.reverse_action("detail", args=[name])


def test_recettes_list_contains_2_recettes():
    ingredients, categories = _create_ingredients_and_categories()
    recette1 = RecetteFactory(ingredients=ingredients, categories=categories)
    recette2 = RecetteFactory(ingredients=ingredients, categories=categories)
    url = _get_recettes_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = RecetteViewSet.as_view({'get': 'list'})(request)
    assert response.status_code == 200
    assertContains(response, recette1.titre)
    assertContains(response, recette2.titre)


def _create_ingredients_and_categories():
    ingredients, categories = [], []
    for _ in range(10):
        ingredients.append(IngredientRecetteFactory())
        categories.append(CategoryFactory())
    return ingredients, categories


def _get_recettes_list_absolute_url():
    return _get_list_absolute_url(RecetteViewSet, "recettes")


def test_recettes_list_has_correct_fields(recette):
    url = _get_recettes_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = RecetteViewSet.as_view({'get': 'list'})(request)
    assert len(response.data) == 1
    recette_data = response.data[0]
    assert recette_data["id"] == recette.id
    assertContains(response, recette.titre)
    assertContains(response, recette.description)
    assertContains(response, recette.duree)
    assert len(recette_data["ingredients"]) == 10
    assert set(recette_data["ingredients"][0].keys(
    )) == {"ingredient", "amount", "unit"}
    assert recette_data["ingredients"][0]["ingredient"] == recette.ingredients.first(
    ).ingredient.name
    assert recette_data["ingredients"][0]["unit"] == recette.ingredients.first(
    ).unit.abbreviation
    assert len(recette_data["categories"]) == 10
    assert recette_data["categories"][0] == recette.categories.first().name


def test_adding_recette():
    assert Recette.objects.count() == 0
    _add_recette()
    assert Recette.objects.count() == 1


def test_adding_recette_deserializes_correctly_all_fields():
    _add_recette()
    recette_added = Recette.objects.first()
    assert recette_added.titre == "titre recette"
    assert recette_added.description == "description recette"
    assert recette_added.duree == datetime.timedelta(seconds=180)
    assert recette_added.ingredients.count() == 1
    assert recette_added.ingredients.first().ingredient.name == "deuxième ingrédient"
    assert recette_added.ingredients.first().amount == Decimal('10.00')
    assert recette_added.ingredients.first().unit.abbreviation == "kg"
    assert recette_added.categories.count() == 1
    assert recette_added.categories.first().name == "dessert"


def _add_recette():
    CategoryFactory(name="dessert")
    IngredientFactory(name="premier ingrédient")
    IngredientFactory(name="deuxième ingrédient")
    IngredientFactory(name="troisième ingrédient")
    masse = UnitTypeFactory(name="masse")
    UnitFactory(abbreviation="kg", type=masse)
    request_data = {"titre": "titre recette",
                    "description": "description recette",
                    "duree": "00:03:00",
                    "ingredients": [{
                        "ingredient": "deuxième ingrédient",
                        "amount": "10.0",
                        "unit": "kg"
                    }],
                    "categories": ["dessert"]}
    url = _get_recettes_list_absolute_url()
    request_post = APIRequestFactory().post(url, data=request_data, format='json')
    response_post = RecetteViewSet.as_view({'post': 'create'})(request_post)
    assert response_post.status_code == 201


def test_delete_recette(recette):
    detail_url = _get_recettes_detail_absolute_url(recette.id)
    request_delete = APIRequestFactory().delete(
        detail_url)
    assert Recette.objects.count() == 1
    response_delete = RecetteViewSet.as_view(
        {'delete': 'destroy'})(request_delete, pk=recette.id)
    assert response_delete.status_code == 204
    assert Recette.objects.count() == 0


def _get_recettes_detail_absolute_url(id):
    view = RecetteViewSet()
    view.basename = "recettes"
    view.request = None
    return view.reverse_action("detail", args=[id])


def test_categories_list_contains_2_categories():
    categorie1 = CategoryFactory()
    categorie2 = CategoryFactory()
    url = _get_categorie_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = CategorieViewSet.as_view({'get': 'list'})(request)
    assert response.status_code == 200
    assertContains(response, categorie1.name)
    assertContains(response, categorie2.name)


def test_categories_list_has_correct_fields():
    CategoryFactory(name="Entrée")
    url = _get_categorie_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = CategorieViewSet.as_view({'get': 'list'})(request)
    assert len(response.data) == 1
    assert response.data[0] == "Entrée"


def _get_categorie_list_absolute_url():
    return _get_list_absolute_url(CategorieViewSet, "categories")
