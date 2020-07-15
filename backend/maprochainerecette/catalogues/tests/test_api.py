import pytest
from pytest_django.asserts import (
    assertContains,
    assertNotContains
)
from rest_framework.test import APIRequestFactory

from catalogues.api import IngredientViewSet, RecetteViewSet
from .factories import (
    IngredientFactory,
    ingredient,
    RecetteFactory,
    recette,
    IngredientRecetteFactory,
    CategoryFactory
)
from unites.tests.factories import UniteFactory, TypeUniteFactory

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
    return _get_list_absolute_url(IngredientViewSet, "ingredients")


def _get_list_absolute_url(viewset_class, viewset_basename):
    view = viewset_class()
    view.basename = viewset_basename
    view.request = None
    return view.reverse_action("list")


def test_adding_ingredient():
    request_data = {'nom': "ingredient name"}
    url = _get_ingredients_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data)
    response_post = IngredientViewSet.as_view({'post': 'create'})(request_post)
    assert response_post.status_code == 201
    response_get = _list_ingredients()
    assertContains(response_get, "ingredient name")


def _list_ingredients():
    list_url = _get_ingredients_list_absolute_url()
    request_get = APIRequestFactory().get(list_url)
    response_get = IngredientViewSet.as_view({'get': 'list'})(request_get)
    assert response_get.status_code == 200
    return response_get


def test_delete_ingredient(ingredient):
    detail_url = _get_ingredients_detail_absolute_url(ingredient.nom)
    request_delete = APIRequestFactory().delete(
        detail_url)
    response_delete = IngredientViewSet.as_view(
        {'delete': 'destroy'})(request_delete, nom=ingredient.nom)
    assert response_delete.status_code == 204
    response_get = _list_ingredients()
    assertNotContains(response_get, ingredient.nom)


def _get_ingredients_detail_absolute_url(nom):
    view = IngredientViewSet()
    view.basename = "ingredients"
    view.request = None
    return view.reverse_action("detail", args=[nom])


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
    assert response.data[0]["id"] == recette.id
    assertContains(response, recette.titre)
    assertContains(response, recette.description)
    assertContains(response, recette.duree)
    assert len(response.data[0]["ingredients"]) == 10
    assert set(response.data[0]["ingredients"][0].keys(
    )) == {"ingredient", "quantite", "unite"}
    assert response.data[0]["ingredients"][0]["ingredient"] == recette.ingredients.first(
    ).ingredient.nom
    assert response.data[0]["ingredients"][0]["unite"] == recette.ingredients.first(
    ).unite.abbreviation
    assert len(response.data[0]["categories"]) == 10
    assert response.data[0]["categories"][0] == recette.categories.first().nom


def test_adding_recette():
    CategoryFactory(nom="dessert")
    IngredientFactory(nom="premier ingrédient")
    masse = TypeUniteFactory(nom="masse")
    UniteFactory(abbreviation="kg", type=masse)
    request_data = {"titre": "titre recette",
                    "description": "description recette",
                    "duree": "00:03:00",
                    "ingredients": [{
                        "ingredient": "premier ingrédient",
                        "quantite": "10.0",
                        "unite": "kg"
                    }],
                    "categories": ["dessert"]}
    url = _get_recettes_list_absolute_url()
    request_post = APIRequestFactory().post(url, data=request_data, format='json')
    response_post = RecetteViewSet.as_view({'post': 'create'})(request_post)
    assert response_post.status_code == 201
    response_get = _list_recettes()
    assertContains(response_get, "titre recette")


def _list_recettes():
    list_url = _get_recettes_list_absolute_url()
    request_get = APIRequestFactory().get(list_url)
    response_get = RecetteViewSet.as_view({'get': 'list'})(request_get)
    assert response_get.status_code == 200
    return response_get


def test_delete_recette(recette):
    detail_url = _get_recettes_detail_absolute_url(recette.id)
    request_delete = APIRequestFactory().delete(
        detail_url)
    response_delete = RecetteViewSet.as_view(
        {'delete': 'destroy'})(request_delete, pk=recette.id)
    assert response_delete.status_code == 204
    response_get = _list_recettes()
    assertNotContains(response_get, recette.titre)


def _get_recettes_detail_absolute_url(id):
    view = RecetteViewSet()
    view.basename = "recettes"
    view.request = None
    return view.reverse_action("detail", args=[id])
