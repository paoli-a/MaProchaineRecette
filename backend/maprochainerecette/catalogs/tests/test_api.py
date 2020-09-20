import datetime
from decimal import Decimal

import pytest
from catalogs.api import CategoryViewSet, IngredientViewSet, RecipeViewSet
from catalogs.models import Ingredient, Recipe
from pytest_django.asserts import assertContains, assertNotContains
from rest_framework.test import APIRequestFactory
from units.tests.factories import UnitFactory, UnitTypeFactory

from .factories import (
    CategoryFactory,
    IngredientFactory,
    RecipeFactory,
    RecipeIngredientFactory,
    ingredient,
    recipe,
)

pytestmark = pytest.mark.django_db


def test_ingredient_list_contains_2_ingredients():
    ingredient1 = IngredientFactory()
    ingredient2 = IngredientFactory()
    url = _get_ingredients_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = IngredientViewSet.as_view({"get": "list"})(request)
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
    request_data = {"name": "ingredient name"}
    url = _get_ingredients_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data)
    assert Ingredient.objects.count() == 0
    response_post = IngredientViewSet.as_view({"post": "create"})(request_post)
    assert response_post.status_code == 201
    assert Ingredient.objects.count() == 1


def test_adding_ingredient_deserializes_correctly_all_fields():
    request_data = {"name": "ingredient name"}
    url = _get_ingredients_list_absolute_url()
    request_post = APIRequestFactory().post(url, request_data)
    response_post = IngredientViewSet.as_view({"post": "create"})(request_post)
    assert response_post.status_code == 201
    assert Ingredient.objects.first().name == "ingredient name"


def test_delete_ingredient(ingredient):
    detail_url = _get_ingredients_detail_absolute_url(ingredient.name)
    request_delete = APIRequestFactory().delete(detail_url)
    assert Ingredient.objects.count() == 1
    response_delete = IngredientViewSet.as_view({"delete": "destroy"})(
        request_delete, name=ingredient.name
    )
    assert response_delete.status_code == 204
    assert Ingredient.objects.count() == 0


def _get_ingredients_detail_absolute_url(name):
    view = IngredientViewSet()
    view.basename = "ingredients"
    view.request = None
    return view.reverse_action("detail", args=[name])


def test_recipes_list_contains_2_recipes():
    ingredients, categories = _create_ingredients_and_categories()
    recipe1 = RecipeFactory(ingredients=ingredients, categories=categories)
    recipe2 = RecipeFactory(ingredients=ingredients, categories=categories)
    url = _get_recipes_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = RecipeViewSet.as_view({"get": "list"})(request)
    assert response.status_code == 200
    assertContains(response, recipe1.title)
    assertContains(response, recipe2.title)


def _create_ingredients_and_categories():
    ingredients, categories = [], []
    for _ in range(10):
        ingredients.append(RecipeIngredientFactory())
        categories.append(CategoryFactory())
    return ingredients, categories


def _get_recipes_list_absolute_url():
    return _get_list_absolute_url(RecipeViewSet, "recipes")


def test_recipes_list_has_correct_fields(recipe):
    url = _get_recipes_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = RecipeViewSet.as_view({"get": "list"})(request)
    assert len(response.data) == 1
    recipe_data = response.data[0]
    assert recipe_data["id"] == recipe.id
    assertContains(response, recipe.title)
    assertContains(response, recipe.description)
    assertContains(response, recipe.duration)
    assert len(recipe_data["ingredients"]) == 10
    assert set(recipe_data["ingredients"][0].keys()) == {"ingredient", "amount", "unit"}
    assert (
        recipe_data["ingredients"][0]["ingredient"]
        == recipe.ingredients.first().ingredient.name
    )
    assert (
        recipe_data["ingredients"][0]["unit"]
        == recipe.ingredients.first().unit.abbreviation
    )
    assert len(recipe_data["categories"]) == 10
    assert recipe_data["categories"][0] == recipe.categories.first().name


def test_adding_recipe():
    assert Recipe.objects.count() == 0
    _add_recipe()
    assert Recipe.objects.count() == 1


def test_adding_recipe_deserializes_correctly_all_fields():
    _add_recipe()
    recipe_added = Recipe.objects.first()
    assert recipe_added.title == "title recipe"
    assert recipe_added.description == "description recipe"
    assert recipe_added.duration == datetime.timedelta(seconds=180)
    assert recipe_added.ingredients.count() == 1
    assert recipe_added.ingredients.first().ingredient.name == "deuxième ingrédient"
    assert recipe_added.ingredients.first().amount == Decimal("10.00")
    assert recipe_added.ingredients.first().unit.abbreviation == "kg"
    assert recipe_added.categories.count() == 1
    assert recipe_added.categories.first().name == "dessert"


def _add_recipe():
    CategoryFactory(name="dessert")
    IngredientFactory(name="premier ingrédient")
    IngredientFactory(name="deuxième ingrédient")
    IngredientFactory(name="troisième ingrédient")
    masse = UnitTypeFactory(name="masse")
    UnitFactory(abbreviation="kg", type=masse)
    request_data = {
        "title": "title recipe",
        "description": "description recipe",
        "duration": "00:03:00",
        "ingredients": [
            {"ingredient": "deuxième ingrédient", "amount": "10.0", "unit": "kg"}
        ],
        "categories": ["dessert"],
    }
    url = _get_recipes_list_absolute_url()
    request_post = APIRequestFactory().post(url, data=request_data, format="json")
    response_post = RecipeViewSet.as_view({"post": "create"})(request_post)
    assert response_post.status_code == 201


def test_delete_recipe(recipe):
    detail_url = _get_recipes_detail_absolute_url(recipe.id)
    request_delete = APIRequestFactory().delete(detail_url)
    assert Recipe.objects.count() == 1
    response_delete = RecipeViewSet.as_view({"delete": "destroy"})(
        request_delete, pk=recipe.id
    )
    assert response_delete.status_code == 204
    assert Recipe.objects.count() == 0


def _get_recipes_detail_absolute_url(id):
    view = RecipeViewSet()
    view.basename = "recipes"
    view.request = None
    return view.reverse_action("detail", args=[id])


def test_categories_list_contains_2_categories():
    categorie1 = CategoryFactory()
    categorie2 = CategoryFactory()
    url = _get_categorie_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = CategoryViewSet.as_view({"get": "list"})(request)
    assert response.status_code == 200
    assertContains(response, categorie1.name)
    assertContains(response, categorie2.name)


def test_categories_list_has_correct_fields():
    CategoryFactory(name="Entrée")
    url = _get_categorie_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = CategoryViewSet.as_view({"get": "list"})(request)
    assert len(response.data) == 1
    assert response.data[0] == "Entrée"


def _get_categorie_list_absolute_url():
    return _get_list_absolute_url(CategoryViewSet, "categories")
