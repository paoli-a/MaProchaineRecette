import pytest
from django.urls import resolve

from .factories import ingredient, recette


pytestmark = pytest.mark.django_db


def test_ingredient_detail_resolve_does_not_raise_404(ingredient):
    url = f"/catalogues/ingredients/{ingredient.name}/"
    assert resolve(url)


def test_recette_detail_resolve_does_not_raise_404(recette):
    url = f"/catalogues/recettes/{recette.id}/"
    assert resolve(url)
