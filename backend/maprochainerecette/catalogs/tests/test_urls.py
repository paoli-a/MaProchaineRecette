import pytest
from django.urls import resolve

pytestmark = pytest.mark.django_db


def test_ingredient_detail_resolve_does_not_raise_404(ingredient):
    url = f"/api/catalogs/ingredients/{ingredient.name}/"
    assert resolve(url)


def test_recipe_detail_resolve_does_not_raise_404(recipe):
    url = f"/api/catalogs/recipes/{recipe.id}/"
    assert resolve(url)
