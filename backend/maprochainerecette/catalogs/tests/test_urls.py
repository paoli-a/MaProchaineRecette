import pytest
from django.urls import resolve

from .factories import ingredient, recipe

pytestmark = pytest.mark.django_db


def test_ingredient_detail_resolve_does_not_raise_404(ingredient):
    url = f"/catalogs/ingredients/{ingredient.name}/"
    assert resolve(url)


def test_recipe_detail_resolve_does_not_raise_404(recipe):
    url = f"/catalogs/recipes/{recipe.id}/"
    assert resolve(url)
