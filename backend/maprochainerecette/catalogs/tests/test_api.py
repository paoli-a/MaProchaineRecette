import datetime
import uuid
from datetime import timedelta
from decimal import Decimal

import pytest
from catalogs.api import CategoryViewSet, IngredientViewSet, RecipeViewSet
from catalogs.models import Ingredient, Recipe
from pytest_django.asserts import assertContains
from rest_framework.test import APIRequestFactory
from units.tests.factories import UnitFactory, UnitTypeFactory

from .factories import (
    CategoryFactory,
    IngredientFactory,
    RecipeFactory,
    RecipeIngredientFactory,
)

pytestmark = pytest.mark.django_db


# ingredients


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


# recipes


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
    assert uuid.UUID(recipe_data["id"]) == recipe.id
    assertContains(response, recipe.title)
    assertContains(response, recipe.description)
    assertContains(response, str(recipe.duration)[:-3])
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


def test_recipes_list_serialises_correctly_duration_field():
    RecipeFactory(duration=timedelta(hours=3, minutes=40))
    url = _get_recipes_list_absolute_url()
    request = APIRequestFactory().get(url)
    response = RecipeViewSet.as_view({"get": "list"})(request)
    recipe_data = response.data[0]
    assert recipe_data["duration"] == "03:40"


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


def test_updating_recipe_deserializes_correctly_all_fields():
    masse = UnitTypeFactory(name="masse")
    UnitFactory(abbreviation="g", type=masse)
    ingredients, categories = [], []
    for _ in range(5):
        ingredients.append(RecipeIngredientFactory())
        categories.append(CategoryFactory())
    recipe = RecipeFactory(ingredients=ingredients[:3], categories=categories[:3])
    url = _get_recipes_detail_absolute_url(recipe.id)
    request_data = {
        "title": "titre modifié",
        "description": "description modifiée",
        "duration": "04:00",
        "ingredients": [
            {
                "ingredient": ingredients[0].ingredient.name,
                "amount": "5.0",
                "unit": "g",
            },
            {"ingredient": ingredients[4].ingredient.name, "amount": "2", "unit": "g"},
        ],
        "categories": [categories[4].name],
    }
    request_put = APIRequestFactory().put(url, data=request_data, format="json")
    response_put = RecipeViewSet.as_view({"put": "update"})(request_put, pk=recipe.id)
    assert response_put.status_code == 200
    recipe_modified = Recipe.objects.first()
    assert recipe_modified.title == "titre modifié"
    assert recipe_modified.description == "description modifiée"
    assert recipe_modified.duration == datetime.timedelta(seconds=14400)
    assert recipe_modified.ingredients.count() == 2
    recipe_modified.ingredients.get(
        ingredient__name=ingredients[0].ingredient.name,
        amount=5.0,
        unit__abbreviation="g",
    )
    recipe_modified.ingredients.get(
        ingredient__name=ingredients[4].ingredient.name,
        amount=2,
        unit__abbreviation="g",
    )
    assert recipe_modified.categories.count() == 1
    assert recipe_modified.categories.first().name == categories[4].name


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
        "duration": "00:03",
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


# categories


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
